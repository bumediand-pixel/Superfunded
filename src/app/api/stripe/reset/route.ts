/**
 * Reset purchase — when a user fails a challenge, they can buy a discounted reset
 * for the same plan + mode. Reset price is 50% of the original 2-step fee, regardless
 * of which mode the original cont was on (industry standard).
 */
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANURI_STRIPE, type PlanId } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimiter';

const ResetSchema = z.object({ contId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`reset:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const parsed = ResetSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Cont invalid' }, { status: 400 });

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });

  const cont = await prisma.contTrader.findFirst({
    where: { id: parsed.data.contId, utilizatorId: utilizator.id },
  });
  if (!cont) return NextResponse.json({ error: 'Cont nu îți aparține' }, { status: 403 });
  if (cont.statusEvaluare !== 'RESPINS') {
    return NextResponse.json({ error: 'Reset disponibil doar pentru conturi respinse' }, { status: 400 });
  }

  const planInfo = PLANURI_STRIPE[cont.plan as PlanId];
  if (!planInfo) return NextResponse.json({ error: 'Plan invalid' }, { status: 400 });

  // 50% off the cheaper (2-step) tier as the reset price
  const resetPrice = Math.round(planInfo.price2step * 0.5);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `SuperFunded Reset — ${planInfo.name}`,
          description: `Reset pe contul ${cont.id} (50% off). Capitalul revine la €${planInfo.capital}, ștergi pierderea acumulată.`,
        },
        unit_amount: resetPrice,
      },
      quantity: 1,
    }],
    metadata: {
      userId: user.id,
      kind: 'reset',
      contId: cont.id,
      plan: cont.plan,
      capital: planInfo.capital.toString(),
    },
    customer_email: user.email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&reset=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?reset_cancelled=true`,
  });

  return NextResponse.json({ url: session.url, price: resetPrice / 100 });
}
