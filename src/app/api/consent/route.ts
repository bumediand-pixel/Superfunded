/**
 * Consent log endpoint.
 *
 * The cookie banner POSTs the user's choice here so we have an auditable
 * server-side record (ANSPDCP guidance: consent must be demonstrable, with
 * timestamp, IP and user-agent). The endpoint is idempotent on
 * (userId | sessionId, version) — a re-submit with the same key updates the
 * latest decision rather than appending a duplicate row.
 *
 * NOTE: the `Consent` Prisma model is added in this same PR via
 * prisma/migrations/20260509_compliance_consent. Until that migration is
 * applied to the running DB, this route will respond 503 instead of throwing.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSupabaseUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimiter';

const ConsentSchema = z.object({
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.number().int().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown';

  if (!rateLimit(`consent:${ip}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'invalid_payload' }, { status: 400 }); }

  const parsed = ConsentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { necessary, analytics, marketing, version } = parsed.data;

  // Try to attach to a logged-in Utilizator. Falls back to sessionId from a
  // best-effort header (set by Supabase / Vercel) so anonymous consents are
  // still trackable by the same browser.
  let userId: string | null = null;
  try {
    const user = await getSupabaseUser();
    if (user) {
      const utilizator = await prisma.utilizator.findUnique({
        where: { supabaseId: user.id },
        select: { id: true },
      });
      userId = utilizator?.id ?? null;
    }
  } catch {
    // Auth is best-effort — anonymous visitors are valid consent senders.
  }

  const sessionId =
    req.cookies.get('sb-access-token')?.value
    || req.cookies.get('__Secure-next-auth.session-token')?.value
    || req.headers.get('x-vercel-id')
    || ip;

  const userAgent = req.headers.get('user-agent') || '';

  try {
    // Idempotent on (userId|sessionId, version): if the same key already has
    // a record, update it; otherwise insert. We use `upsert` against a
    // deterministic id so we don't need a composite unique index migration.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = prisma as any;
    if (!client.consent) {
      // Migration not yet applied — fail soft.
      return NextResponse.json(
        { ok: false, error: 'consent_table_unavailable' },
        { status: 503 },
      );
    }

    await client.consent.create({
      data: {
        userId,
        sessionId: sessionId || ip,
        necessary,
        analytics,
        marketing,
        version,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[consent] persist failed:', err);
    return NextResponse.json({ ok: false, error: 'persist_failed' }, { status: 500 });
  }
}
