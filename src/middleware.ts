import { NextRequest, NextResponse } from 'next/server';

/**
 * Affiliate referral tracking — captures `?ref=CODE` from any landing URL and
 * persists it in a 30-day httpOnly cookie. Read on /register to attribute the signup.
 */
export function middleware(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.next();

  // basic sanity-check: alphanumeric, max 32 chars
  if (!/^[A-Za-z0-9_-]{3,32}$/.test(ref)) return NextResponse.next();

  const res = NextResponse.next();
  // 30 days; httpOnly stops random JS from rewriting it
  res.cookies.set('sf_ref', ref, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|robots|sitemap).*)'],
};
