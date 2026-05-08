import { NextRequest, NextResponse } from 'next/server';
import { stripe, rulesForMode, type ChallengeMode } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { z } from 'zod';
import { sendPlanActivatEmail } from '@/lib/email';

const MetadataSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['STARTER_500', 'BASIC_1000', 'STANDARD_5000', 'ADVANCED_10000', 'PRO_25000', 'ELITE_50000']),
  capital: z.string().regex(/^\d+(\.\d+)?$/),
  mode: z.enum(['1step', '2step']).optional().default('2step'),
  split: z.string().regex(/^\d+$/).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Lipsă semnătură' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const kind = session.metadata?.kind;
        if (kind === 'reset')      await handleResetPurchase(session);
        else if (kind === 'scale') await handleScalePurchase(session);
        else                       await handleCheckoutCompleted(session);
        break;
      }

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await handleDispute(event.data.object as Stripe.Dispute);
        break;

      default:
        // ignore other events but acknowledge so Stripe stops retrying
        break;
    }
  } catch (err) {
    console.error(`[stripe-webhook] error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Eroare la procesare' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const parsed = MetadataSchema.safeParse(session.metadata ?? {});
  if (!parsed.success) {
    console.error('[stripe-webhook] invalid metadata:', parsed.error.flatten());
    return;
  }
  const { userId, plan, capital, mode } = parsed.data;
  const capitalNum = parseFloat(capital);

  // Idempotency: bail if we already provisioned this session
  const existing = await prisma.contTrader.findUnique({ where: { stripeSessionId: session.id } });
  if (existing) {
    console.log('[stripe-webhook] session already provisioned:', session.id);
    return;
  }

  // Upsert user (in case the Supabase row hasn't been mirrored to our DB yet)
  let utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: userId } });
  if (!utilizator) {
    utilizator = await prisma.utilizator.create({
      data: {
        supabaseId: userId,
        email: session.customer_email ?? `${userId}@unknown.local`,
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
      },
    });
  } else if (typeof session.customer === 'string' && !utilizator.stripeCustomerId) {
    await prisma.utilizator.update({
      where: { id: utilizator.id },
      data: { stripeCustomerId: session.customer },
    });
  }

  // Build phase rules from the helper (single source of truth)
  const rules = rulesForMode(mode as ChallengeMode).map(r => ({
    numeFaza: r.numeFaza,
    targetProfit: r.targetProfit * capitalNum, // store as absolute EUR target
    maxPierdere:  r.maxPierdere  * capitalNum,
    maxZilnic:    r.maxZilnic    * capitalNum,
    zileMinime:   r.zileMinime,
  }));

  await prisma.contTrader.create({
    data: {
      utilizatorId:   utilizator.id,
      plan,
      capitalInceput: capitalNum,
      capitalCurent:  capitalNum,
      statusEvaluare: 'FAZA_1',
      fazaCurenta:    1,
      dataStart:      new Date(),
      stripeSessionId: session.id,
      reguli:         { create: rules },
    },
  });

  if (session.customer_email) {
    sendPlanActivatEmail(session.customer_email, plan, capitalNum).catch(err =>
      console.error('[stripe-webhook] sendPlanActivatEmail failed:', err)
    );
  }
}

async function handleResetPurchase(session: Stripe.Checkout.Session) {
  const contId = session.metadata?.contId;
  if (!contId) return;
  const cont = await prisma.contTrader.findUnique({ where: { id: contId }, include: { reguli: true } });
  if (!cont) return;
  // Reset: capital back to start, evaluation FAZA_1, profit/loss zeroed, mark all rules incomplete.
  await prisma.$transaction(async tx => {
    await tx.contTrader.update({
      where: { id: contId },
      data: {
        capitalCurent:  cont.capitalInceput,
        statusEvaluare: 'FAZA_1',
        fazaCurenta:    1,
        profitTotal:    0,
        pierdereMaxima: 0,
        tranzactiiTotal: 0,
        activ:          true,
        dataStart:      new Date(),
        dataFinalizare: null,
      },
    });
    for (const r of cont.reguli) {
      await tx.regulaCont.update({ where: { id: r.id }, data: { completata: false } });
    }
  });
  console.log('[stripe-webhook] reset applied to cont', contId);
}

async function handleScalePurchase(session: Stripe.Checkout.Session) {
  const contId   = session.metadata?.contId;
  const newPlan  = session.metadata?.plan;
  const capital  = session.metadata?.capital;
  if (!contId || !newPlan || !capital) return;
  const capitalNum = parseFloat(capital);
  if (Number.isNaN(capitalNum)) return;

  await prisma.contTrader.update({
    where: { id: contId },
    data: {
      plan:           newPlan as 'BASIC_1000'|'STANDARD_5000'|'ADVANCED_10000'|'PRO_25000'|'ELITE_50000',
      capitalInceput: capitalNum,
      capitalCurent:  capitalNum,
      profitTotal:    0,
      tranzactiiTotal: 0,
      // keep statusEvaluare = FINANTAT, no need to re-evaluate
    },
  });
  console.log('[stripe-webhook] scaled cont', contId, '→', newPlan);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const sessionId = charge.metadata?.checkout_session_id;
  if (!sessionId) return;
  const cont = await prisma.contTrader.findUnique({ where: { stripeSessionId: sessionId } });
  if (!cont) return;
  await prisma.contTrader.update({
    where: { id: cont.id },
    data: { activ: false, statusEvaluare: 'SUSPENDAT' },
  });
}

async function handleDispute(dispute: Stripe.Dispute) {
  const charge = typeof dispute.charge === 'string'
    ? await stripe.charges.retrieve(dispute.charge)
    : dispute.charge;
  const sessionId = charge?.metadata?.checkout_session_id;
  if (!sessionId) return;
  const cont = await prisma.contTrader.findUnique({ where: { stripeSessionId: sessionId } });
  if (!cont) return;
  await prisma.contTrader.update({
    where: { id: cont.id },
    data: { activ: false, statusEvaluare: 'SUSPENDAT' },
  });
}
