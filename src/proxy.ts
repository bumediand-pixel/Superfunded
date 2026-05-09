/**
 * Next.js 16 Proxy (formerly "middleware").
 *
 * Two responsibilities, in order:
 *   1. Affiliate referral cookie capture — preserved verbatim from the legacy
 *      proxy.ts: catch `?ref=CODE` on any landing URL and persist a 30-day
 *      httpOnly cookie so /register can attribute the signup.
 *   2. Edge rate limiting on hot API surfaces. The proxy only enforces blanket
 *      IP-based limits here; per-user limits (`/api/retrageri`, `/api/bets`)
 *      live inside their route handlers where the user identity is known.
 *
 * NOTE on the file convention: Next.js 16 deprecated `middleware.ts` in favour
 * of `proxy.ts`. The user task description called for `src/middleware.ts`, but
 * the framework ignores that file name in v16 — using `proxy.ts` is the only
 * way to keep this code in the request pipeline. See:
 *   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
import { NextRequest, NextResponse } from 'next/server';
import { check, ipFromRequest, limiters, rateLimitHeaders } from '@/lib/ratelimit';

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ── Rate limiting (API surfaces) ──────────────────────────────────────────
  // Per-user limiters for /api/retrageri (3/h) and /api/bets (30/m) live in
  // the route handlers themselves because they need the authenticated user id;
  // this proxy applies a coarse IP-based default + the brute-force guard on
  // /api/auth/*.
  if (pathname.startsWith('/api/auth/')) {
    const decision = await check(limiters.auth, ipFromRequest(req));
    if (!decision.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Prea multe încercări. Încearcă din nou mai târziu.' }),
        { status: 429, headers: { 'content-type': 'application/json', ...rateLimitHeaders(decision) } },
      );
    }
  } else if (
    pathname.startsWith('/api/') &&
    // Webhooks must never be rate-limited by us — Stripe and Sumsub will retry
    // and constructEvent / HMAC already guards them.
    !pathname.startsWith('/api/stripe/webhook') &&
    !pathname.startsWith('/api/kyc/webhook') &&
    // Cron is auth-gated by CRON_SECRET, no point spending a Redis hit.
    !pathname.startsWith('/api/cron/') &&
    // Per-user routes apply their own stricter limit inside the handler.
    !pathname.startsWith('/api/retrageri') &&
    !pathname.startsWith('/api/pariuri') &&
    !pathname.startsWith('/api/bets')
  ) {
    const decision = await check(limiters.default, ipFromRequest(req));
    if (!decision.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Prea multe cereri' }),
        { status: 429, headers: { 'content-type': 'application/json', ...rateLimitHeaders(decision) } },
      );
    }
  }

  // ── Affiliate referral cookie capture (preserved from legacy proxy.ts) ────
  const ref = searchParams.get('ref');
  if (ref && /^[A-Za-z0-9_-]{3,32}$/.test(ref)) {
    const res = NextResponse.next();
    res.cookies.set('sf_ref', ref, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  }

  return NextResponse.next();
}

// Run on every request EXCEPT static assets — we need /api/* for rate limiting.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
