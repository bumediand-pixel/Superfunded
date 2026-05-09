/**
 * Cron-route auth guard.
 *
 * Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` on every scheduled
 * invocation. Manual curls are expected to do the same. We use timing-safe
 * comparison so attackers can't probe for the secret with a side-channel.
 *
 * Usage in a Route Handler:
 *
 *   export async function GET(req: NextRequest) {
 *     const denied = requireCronAuth(req);
 *     if (denied) return denied;
 *     // ... the actual cron work
 *   }
 */
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

/**
 * Returns `null` when authorised, otherwise a 403 NextResponse the caller can
 * return directly. Throws synchronously if `CRON_SECRET` is missing in the
 * environment — that is a deployment misconfiguration, not a runtime auth
 * failure, and we want loud failure during boot rather than silent allow.
 */
export function requireCronAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    // Misconfiguration — refuse to run rather than fail-open.
    console.error('[cron-auth] CRON_SECRET is missing or too short');
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }

  const header = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;

  // Constant-time compare; bail out on length mismatch first because
  // timingSafeEqual itself throws on differing lengths.
  const aBuf = Buffer.from(header);
  const bBuf = Buffer.from(expected);
  if (aBuf.length !== bBuf.length) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!timingSafeEqual(aBuf, bBuf)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
