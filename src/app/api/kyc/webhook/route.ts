import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendKYCStatusEmail } from '@/lib/email';

/**
 * Sumsub KYC webhook — hardened.
 *
 *   - Reads RAW body (text) and verifies `X-Payload-Digest` (HMAC-SHA256 hex)
 *     against `SUMSUB_WEBHOOK_SECRET` using a constant-time compare.
 *   - Idempotent: stores `sumsub:<digest>` in `ProcessedWebhookEvent`. The
 *     digest is unique per delivery so it's a perfect dedupe key.
 *   - Handles `applicantReviewed` to flip the user's KYC status, fires
 *     a transactional email on every status change. Other event types are
 *     accepted with a 200 so Sumsub doesn't retry.
 *
 * Notes on the env var: prior code referenced `SUMSUB_SECRET_KEY` which is
 * actually the API access secret. The webhook signing secret is configured
 * separately in the Sumsub admin UI; we now read `SUMSUB_WEBHOOK_SECRET` and
 * fall back to `SUMSUB_SECRET_KEY` for backwards compatibility.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type SumsubPayload = {
  type?: string;
  applicantId?: string;
  reviewResult?: { reviewAnswer?: string; rejectLabels?: string[] };
};

function timingSafeHexEqual(a: string, b: string): boolean {
  if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b)) return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

export async function POST(req: NextRequest) {
  const secret = process.env.SUMSUB_WEBHOOK_SECRET ?? process.env.SUMSUB_SECRET_KEY;
  if (!secret) {
    console.error('[sumsub-webhook] SUMSUB_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Configurare incompletă' }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get('x-payload-digest') ?? '';

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (!timingSafeHexEqual(sig, expected)) {
    return NextResponse.json({ error: 'Semnătură invalidă' }, { status: 401 });
  }

  // Parse only AFTER signature passes — never trust the body otherwise.
  let payload: SumsubPayload;
  try {
    payload = JSON.parse(body) as SumsubPayload;
  } catch {
    return NextResponse.json({ error: 'JSON invalid' }, { status: 400 });
  }

  // Idempotency — the HMAC digest is unique per delivery (Sumsub re-signs on
  // retry only if the body changes; identical body → identical digest).
  const idempotencyId = `sumsub:${expected}`;
  try {
    await prisma.processedWebhookEvent.create({
      data: {
        id:        idempotencyId,
        provider:  'sumsub',
        eventId:   expected.slice(0, 32),
        eventType: payload.type ?? 'unknown',
        payloadHash: expected,
      },
    });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    throw e;
  }

  try {
    if (payload.type === 'applicantReviewed' && payload.applicantId) {
      const status: 'APROBAT' | 'RESPINS' =
        payload.reviewResult?.reviewAnswer === 'GREEN' ? 'APROBAT' : 'RESPINS';

      await prisma.utilizator.updateMany({
        where: { sumsubApplicantId: payload.applicantId },
        data:  { statusKYC: status },
      });

      const utilizator = await prisma.utilizator.findFirst({
        where: { sumsubApplicantId: payload.applicantId },
        select: { email: true },
      });
      if (utilizator?.email) {
        await sendKYCStatusEmail(utilizator.email, status).catch(err =>
          console.error('[sumsub-webhook] sendKYCStatusEmail failed:', err)
        );
      }
    }
  } catch (err) {
    console.error('[sumsub-webhook] handler failed:', err);
    // Roll back idempotency claim so the next Sumsub retry can re-execute.
    await prisma.processedWebhookEvent.delete({ where: { id: idempotencyId } }).catch(() => {});
    return NextResponse.json({ error: 'Eroare la procesare' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
