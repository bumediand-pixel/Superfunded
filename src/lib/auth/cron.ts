/**
 * Shared authentication for Vercel Cron / GitHub Actions cron triggers.
 *
 * Every `/api/cron/*` route MUST call `requireCronAuth(req)` before doing any
 * work. Vercel Cron is documented to send `Authorization: Bearer ${CRON_SECRET}`
 * on every invocation; if the header is missing or doesn't match we return a
 * 403 so anonymous internet traffic can never trigger heavy server jobs.
 *
 * Why a constant-time compare: a naive `===` would leak length / prefix bytes
 * through timing side channels. We zero-pad both sides to the same length and
 * use `crypto.timingSafeEqual`.
 */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const FORBIDDEN = NextResponse.json({ error: 'Forbidden' }, { status: 403 });

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * Returns `null` when the request is authorized (callers should `continue`)
 * or a `NextResponse` 403 to short-circuit the route.
 *
 * Usage:
 *   const denied = requireCronAuth(req);
 *   if (denied) return denied;
 */
export function requireCronAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // No secret configured = lock everything down. Better safe than open.
    console.error('[cron-auth] CRON_SECRET is not configured — refusing all cron requests');
    return FORBIDDEN;
  }

  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  if (!safeEqual(auth, expected)) return FORBIDDEN;

  return null;
}
