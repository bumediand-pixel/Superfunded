import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { sendKYCStatusEmail } from '@/lib/email';

// Sumsub HMAC verification + raw body parsing requires the Node runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SumsubPayload = {
  type?: string;
  reviewResult?: { reviewAnswer?: string };
  applicantId?: string;
  // Sumsub also sends an `externalUserId` we could correlate, plus event-id-like
  // fields. We keep the schema deliberately lax — Sumsub adds keys over time.
  [k: string]: unknown;
};

export async function POST(req: NextRequest) {
  // 1. Read raw body — required for HMAC over the exact bytes Sumsub signed.
  const body = await req.text();

  // 2. Verify signature BEFORE JSON.parse. Reject malformed/unsigned payloads
  // without revealing parser errors.
  const sig = req.headers.get('x-payload-digest') ?? '';
  // Sumsub uses the dash-separated header name; some proxies normalise. Try both.
  const digestAlgo = req.headers.get('x-payload-digest-alg') ?? 'HMAC_SHA256_HEX';
  const secret =
    process.env.SUMSUB_WEBHOOK_SECRET ??
    process.env.SUMSUB_SECRET_KEY; // back-compat with prior deployments
  if (!secret) {
    console.error('[kyc-webhook] SUMSUB_WEBHOOK_SECRET / SUMSUB_SECRET_KEY not set');
    return NextResponse.json({ error: 'Webhook nu este configurat' }, { status: 503 });
  }

  // We currently support HMAC-SHA256 hex (Sumsub default). Refuse anything else
  // explicitly so an attacker can't downgrade to a weaker algo.
  if (digestAlgo !== 'HMAC_SHA256_HEX') {
    return NextResponse.json({ error: 'Algoritm nesuportat' }, { status: 400 });
  }

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  // Constant-time compare — guards against timing oracles.
  let sigValid = false;
  try {
    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    sigValid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    sigValid = false;
  }
  if (!sigValid) {
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 401 });
  }

  // 3. Parse — we already know the body is integrity-checked.
  let payload: SumsubPayload;
  try {
    payload = JSON.parse(body) as SumsubPayload;
  } catch {
    return NextResponse.json({ error: 'JSON invalid' }, { status: 400 });
  }

  // 4. Idempotency. Sumsub does not include a stable event id on every payload,
  // so we synthesise one from (applicantId|type|reviewAnswer|sig). Same payload
  // → same key → unique constraint blocks the dupe.
  const eventId = crypto
    .createHash('sha256')
    .update(`${payload.applicantId ?? ''}|${payload.type ?? ''}|${payload.reviewResult?.reviewAnswer ?? ''}|${sig}`)
    .digest('hex');

  try {
    await prisma.processedWebhookEvent.create({
      data: { provider: 'sumsub', eventId, eventType: payload.type ?? null },
    });
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error('[kyc-webhook] failed to record event:', err);
    return NextResponse.json({ error: 'Eroare internă' }, { status: 500 });
  }

  // 5. Side-effects.
  try {
    if (payload.type === 'applicantReviewed' && payload.applicantId) {
      const status: 'APROBAT' | 'RESPINS' =
        payload.reviewResult?.reviewAnswer === 'GREEN' ? 'APROBAT' : 'RESPINS';

      await prisma.utilizator.updateMany({
        where: { sumsubApplicantId: payload.applicantId },
        data: { statusKYC: status },
      });

      const utilizator = await prisma.utilizator.findFirst({
        where: { sumsubApplicantId: payload.applicantId },
      });
      if (utilizator?.email) {
        await sendKYCStatusEmail(utilizator.email, status).catch((e) =>
          console.error('[kyc-webhook] sendKYCStatusEmail failed:', e),
        );
      }
    }
  } catch (err) {
    // Roll back idempotency record so Sumsub retries.
    console.error('[kyc-webhook] handler error:', err);
    await prisma.processedWebhookEvent
      .deleteMany({ where: { provider: 'sumsub', eventId } })
      .catch(() => { /* swallow */ });
    return NextResponse.json({ error: 'Eroare la procesare' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
