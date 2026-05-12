/**
 * POST /api/crypto/webhook
 * IPN endpoint pentru NOWPayments.
 *
 * NOWPayments trimite un POST JSON la fiecare schimbare de status:
 *   waiting → confirming → confirmed → sending → finished
 *           ↘ failed / expired / refunded
 *
 * Ne interesează `payment_status === 'finished'` pentru provisioning,
 * și `refunded` / `failed` pentru reversare (rare, dar le logăm).
 *
 * Securitate: signature HMAC-SHA512 pe body-ul sortat alfabetic, cheia
 * `NOWPAYMENTS_IPN_SECRET`. Vezi src/lib/nowpayments.ts → verifyIpnSignature.
 *
 * Provisioning: același cod ca Stripe webhook — citește orderId formatat
 * `userId:plan:mode:timestamp`, creează ContTrader cu FAZA_1 + reguli.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyIpnSignature } from '@/lib/nowpayments';
import { prisma } from '@/lib/prisma';
import { rulesForMode, type ChallengeMode } from '@/lib/stripe';
import { sendPlanActivatEmail } from '@/lib/email';

type Ipn = {
  payment_id?: string | number;
  payment_status?: string;
  pay_address?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  purchase_id?: string | number;
};

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-nowpayments-sig') ?? '';

  if (!await verifyIpnSignature(raw, sig)) {
    return NextResponse.json({ error: 'Signature invalid' }, { status: 401 });
  }

  let data: Ipn;
  try { data = JSON.parse(raw); }
  catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }

  const orderId = data.order_id ?? '';
  const status  = data.payment_status ?? '';
  console.log(`[crypto/webhook] ${status} for ${orderId}`);

  // Only act on finished. Other statuses are logged but ignored (NOWPayments
  // can re-send the same status multiple times, so the idempotency check below
  // covers replays).
  if (status !== 'finished') {
    return NextResponse.json({ received: true, ignored: status });
  }

  // orderId format: `${userId}:${plan}:${mode}:${timestamp}`
  const [userId, plan, mode] = orderId.split(':');
  if (!userId || !plan || (mode !== '1step' && mode !== '2step')) {
    console.error('[crypto/webhook] malformed order_id:', orderId);
    return NextResponse.json({ error: 'order_id invalid' }, { status: 400 });
  }

  // Idempotency: dacă există deja un cont legat de acest payment_id, ieșim.
  const paymentRef = `nowp_${data.payment_id ?? data.purchase_id ?? orderId}`;
  const already = await prisma.contTrader.findUnique({ where: { stripeSessionId: paymentRef } });
  if (already) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  // Upsert user din Supabase id.
  let utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: userId } });
  if (!utilizator) {
    utilizator = await prisma.utilizator.create({
      data: { supabaseId: userId, email: `${userId}@unknown.local` },
    });
  }

  // Map plan → capital (kept in stripe.ts as single source of truth).
  const { PLANURI_STRIPE } = await import('@/lib/stripe');
  const planKey = plan as keyof typeof PLANURI_STRIPE;
  if (!PLANURI_STRIPE[planKey]) {
    return NextResponse.json({ error: 'plan unknown' }, { status: 400 });
  }
  const capital = PLANURI_STRIPE[planKey].capital;

  // Seed phase rules — same fractions ca Stripe webhook face.
  const rules = rulesForMode(mode as ChallengeMode).map(r => ({
    numeFaza: r.numeFaza,
    targetProfit: r.targetProfit * capital,
    maxPierdere:  r.maxPierdere  * capital,
    maxZilnic:    r.maxZilnic    * capital,
    zileMinime:   r.zileMinime,
  }));

  await prisma.contTrader.create({
    data: {
      utilizatorId:   utilizator.id,
      plan:           planKey,
      capitalInceput: capital,
      capitalCurent:  capital,
      statusEvaluare: 'FAZA_1',
      fazaCurenta:    1,
      dataStart:      new Date(),
      stripeSessionId: paymentRef, // reuse field for unique crypto ref
      reguli:         { create: rules },
    },
  });

  if (utilizator.email && !utilizator.email.includes('@unknown.local')) {
    sendPlanActivatEmail(utilizator.email, planKey, capital).catch(err =>
      console.error('[crypto/webhook] email failed:', err)
    );
  }

  return NextResponse.json({ received: true, provisioned: true });
}
