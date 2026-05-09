import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimiter';
import { createServerSupabase } from '@/lib/supabase-server';

// Compliance: GDPR consent log endpoint.
// - Body: { necessary: true, analytics: bool, marketing: bool, version: string }
// - Persists to Consent table (see prisma/schema.prisma).
// - Idempotent on (userId|sessionId, version): same combo on retry => single row.
// - Cookie `sf_consent_sid` provides anonymous session id for non-authed users.

const Schema = z.object({
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.string().min(1).max(64),
});

const SESSION_COOKIE = 'sf_consent_sid';

function ensureSessionId(req: NextRequest, res: NextResponse): string {
  const existing = req.cookies.get(SESSION_COOKIE)?.value;
  if (existing && existing.length >= 16) return existing;
  const sid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  res.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return sid;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!rateLimit(`consent:${ip}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 512) ?? '';

  // Resolve current user (if any) — Consent works for anonymous + authed visitors.
  let userId: string | null = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const u = await prisma.utilizator.findUnique({
        where: { supabaseId: data.user.id },
        select: { id: true },
      });
      userId = u?.id ?? null;
    }
  } catch {
    // Anonymous visitor — proceed with sessionId only.
  }

  const res = NextResponse.json({ ok: true });
  const sessionId = ensureSessionId(req, res);

  // Idempotent on (sessionId, version): a retry from the same browser for the
  // same policy version updates the existing row instead of creating a duplicate.
  try {
    await prisma.consent.upsert({
      where: { sessionId_version: { sessionId, version: parsed.data.version } },
      create: {
        userId,
        sessionId,
        necessary: true,
        analytics: parsed.data.analytics,
        marketing: parsed.data.marketing,
        version: parsed.data.version,
        ip,
        userAgent,
      },
      update: {
        userId: userId ?? undefined,
        analytics: parsed.data.analytics,
        marketing: parsed.data.marketing,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    console.error('[consent] persist failed:', err);
    // Don't block the user — client cookie is the source of truth.
    return res;
  }

  return res;
}
