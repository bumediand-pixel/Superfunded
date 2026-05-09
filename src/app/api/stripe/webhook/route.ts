import { NextRequest, NextResponse } from 'next/server';
import { stripe, rulesForMode, type ChallengeMode } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { z } from 'zod';
import { sendPlanActivatEmail } from '@/lib/email';

/**
 * Stripe webhook handler — hardened for production.
 *
 *   - Reads the **raw** request body via `req.text()` (constructEvent verifies
 *     the HMAC over the original bytes; parsing first would corrupt it).
 *   - Verifies signature against `STRIPE_WEBHOOK_SECRET`. Failure = 400.
 *   - Records every accepted event in `ProcessedWebhookEvent` so retries
 *     become a no-op. We INSERT before running the handler; if the insert
 *     fails on the unique PK we know the event was already processed.
 *   - Handlers covered: checkout.session.completed, payment_intent.succeeded,
 *     charge.refunded, charge.dispute.created. Unknown events are ack'd
 *     (return 200) so Stripe stops retrying.
 *
 * Important: keep this route runtime as Node (default) — Edge can't read
 * raw bodies the way the Stripe SDK expects.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MetadataSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['STARTER_500', 'BASIC_1000', 'STANDARD_5000', 'ADVANCED_10000', 'PRO_25000', 'ELITE_50000']),
  capital: z.string().regex(/^\d+(\.\d+)?$/),
  mode: z.enum(['1step', '2step']).optional().default('2step'),
  split: z.string().regex(/^\d+$/).optional(),
});

/** Returns true if we just claimed this event for processing (i.e. first delivery). */
async function claimEvent(eventId: string, eventType: string): Promise<boolean> {
  try {
    await prisma.processedWebhookEvent.create({
      data: {
        id: `stripe:${eventId}`,
        provider: 'stripe',
        eventId,
        eventType,
      },
    });
    return true;
  } catch (e: unknown) {
    // Prisma throws P2002 on unique violation — that's our idempotency signal.
    const code = (e as { code?: string })?.code;
    if (code === 'P2002') return false;
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Configurare incompletă' }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Lipsă semnătură' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 400 });
  }

  // Idempotency gate — atomic claim.
  const claimed = await claimEvent(event.id, event.type);
  if (!claimed) {
    console.log('[stripe-webhook] duplicate event ignored:', event.id, event.type);
    return NextResponse.json({ received: true, duplicate: true });
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

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

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
    // Roll back the idempotency claim so Stripe's next retry can re-attempt
    // the handler. Without this, transient DB errors would silently drop work.
    await prisma.processedWebhookEvent
      .delete({ where: { id: `stripe:${event.id}` } })
      .catch(() => {});
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

/**
 * `payment_intent.succeeded` typically arrives alongside checkout.session.completed
 * but for some PaymentLink / async-flow sessions the PI lands first. We log a
 * positive ledger entry tagged with the PI id so reconciliation tooling can
 * cross-reference Stripe's payments dashboard. Safe to receive multiple times
 * because of the unique idempotencyKey on Ledger.
 */
async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  const sessionId = (pi.metadata?.checkout_session_id as string | undefined) ?? null;
  if (!sessionId) {
    console.log('[stripe-webhook] payment_intent without checkout_session_id, skipping ledger:', pi.id);
    return;
  }
  const cont = await prisma.contTrader.findUnique({
    where: { stripeSessionId: sessionId },
    select: { id: true, utilizatorId: true },
  });
  if (!cont) return;

  await prisma.ledger
    .create({
      data: {
        utilizatorId:   cont.utilizatorId,
        contId:         cont.id,
        kind:           'DEPOSIT',
        amount:         (pi.amount_received ?? pi.amount) / 100,
        currency:       (pi.currency ?? 'eur').toUpperCase(),
        externalRef:    pi.id,
        idempotencyKey: `stripe:pi:${pi.id}`,
        metadata:       { sessionId },
      },
    })
    .catch((e: unknown) => {
      // P2002 = idempotency hit; everything else bubbles up so the webhook
      // retries.
      const code = (e as { code?: string })?.code;
      if (code !== 'P2002') throw e;
    });
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
  // Negative ledger entry to record the refund.
  await prisma.ledger
    .create({
      data: {
        utilizatorId:   cont.utilizatorId,
        contId:         cont.id,
        kind:           'ADJUSTMENT',
        amount:         -((charge.amount_refunded ?? 0) / 100),
        currency:       (charge.currency ?? 'eur').toUpperCase(),
        externalRef:    charge.id,
        idempotencyKey: `stripe:refund:${charge.id}`,
        metadata:       { sessionId, reason: 'charge.refunded' },
      },
    })
    .catch((e: unknown) => {
      const code = (e as { code?: string })?.code;
      if (code !== 'P2002') throw e;
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
