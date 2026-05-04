import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { z } from 'zod';
import { sendPlanActivatEmail } from '@/lib/email';

const MetadataSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['STARTER_500', 'BASIC_1000', 'STANDARD_5000', 'ADVANCED_10000', 'PRO_25000', 'ELITE_50000']),
  capital: z.string().regex(/^\d+(\.\d+)?$/),
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const parsed = MetadataSchema.safeParse(session.metadata);
    if (!parsed.success) {
      console.error('[STRIPE WEBHOOK] Invalid metadata:', parsed.error.flatten());
      return NextResponse.json({ error: 'Metadata invalidă' }, { status: 400 });
    }
    const { userId, plan, capital } = parsed.data;

    let utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: userId } });
    if (!utilizator) {
      utilizator = await prisma.utilizator.create({
        data: { supabaseId: userId, email: session.customer_email ?? '' },
      });
    }

    await prisma.contTrader.create({
      data: {
        utilizatorId: utilizator.id,
        plan,
        capitalInceput: parseFloat(capital),
        capitalCurent: parseFloat(capital),
        statusEvaluare: 'FAZA_1',
        fazaCurenta: 1,
        dataStart: new Date(),
        stripeSessionId: session.id,
        reguli: {
          create: [
            { numeFaza: 'Faza 1', targetProfit: 8, maxPierdere: 8, maxZilnic: 5, zileMinime: 5 },
            { numeFaza: 'Faza 2', targetProfit: 5, maxPierdere: 8, maxZilnic: 5, zileMinime: 5 },
          ],
        },
      },
    });

    if (session.customer_email) {
      await sendPlanActivatEmail(session.customer_email, plan, parseFloat(capital)).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
