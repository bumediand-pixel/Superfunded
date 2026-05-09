/**
 * Edge proxy (Next.js 16 — formerly `middleware`). Two responsibilities:
 *
 *   1. **Rate limiting** for unauthenticated traffic. Authenticated
 *      per-user limits (`/api/retrageri`, `/api/bets`) are enforced inside
 *      the route handlers because we need the resolved Supabase user id.
 *      Here we only apply IP-based caps:
 *        - `/api/auth/*` → 5 / 15 min / IP (credential-stuffing guard)
 *        - everything   → 100 / min / IP  (DoS sanity)
 *
 *   2. **Affiliate referral capture** — `?ref=CODE` is persisted in a
 *      30-day httpOnly cookie so the signup attribution survives a redirect
 *      to `/autentificare/register`.
 *
 * Webhook routes are excluded from the matcher so Stripe/Sumsub deliveries
 * always reach their handler — they have their own signature verification.
 */
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp, rateLimitHeaders } from '@/lib/ratelimit';

const REF_COOKIE_NAME = 'sf_ref';
const REF_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
const REF_VALID = /^[A-Za-z0-9_-]{3,32}$/;

function tooMany(reset: number): NextResponse {
  return NextResponse.json(
    { error: 'Prea multe cereri. Reîncearcă mai târziu.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
      },
    }
  );
}

function applyRefCookie(req: NextRequest, res: NextResponse): NextResponse {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref || !REF_VALID.test(ref)) return res;
  res.cookies.set(REF_COOKIE_NAME, ref, {
    maxAge: REF_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const ip = clientIp(req.headers);

  // /api/auth/* — strict cap to slow brute-force / enumeration.
  if (pathname.startsWith('/api/auth/')) {
    const r = await rateLimit('auth', ip);
    if (!r.success) {
      const res = tooMany(r.reset);
      for (const [k, v] of Object.entries(rateLimitHeaders(r))) res.headers.set(k, v);
      return res;
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(rateLimitHeaders(r))) res.headers.set(k, v);
    return applyRefCookie(req, res);
  }

  // Everything else under /api — coarse default cap.
  if (pathname.startsWith('/api/')) {
    const r = await rateLimit('default', ip);
    if (!r.success) {
      const res = tooMany(r.reset);
      for (const [k, v] of Object.entries(rateLimitHeaders(r))) res.headers.set(k, v);
      return res;
    }
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(rateLimitHeaders(r))) res.headers.set(k, v);
    return res;
  }

  // Marketing / dashboard pages: capture referral code, no rate limit.
  return applyRefCookie(req, NextResponse.next());
}

/**
 * Matcher excludes:
 *  - Stripe + Sumsub webhooks (HMAC-verified, must be untouched)
 *  - Vercel cron route (auth via bearer)
 *  - Static assets / Next internals
 */
export const config = {
  matcher: [
    '/((?!api/stripe/webhook|api/kyc/webhook|api/cron|_next/static|_next/image|favicon|robots|sitemap|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|woff2?)$).*)',
  ],
};
