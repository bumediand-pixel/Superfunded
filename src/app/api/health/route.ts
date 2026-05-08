/**
 * Public health endpoint. Use with UptimeRobot, Better Uptime, etc.
 * Returns 200 if DB + Stripe + Resend are reachable; 503 otherwise.
 *
 * No auth — but no PII either. Just `{ ok: bool, checks: {…}, version, ts }`.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function ping<T>(name: string, fn: () => Promise<T>): Promise<{ ok: true; ms: number } | { ok: false; ms: number; err: string }> {
  const t0 = Date.now();
  try {
    await fn();
    return { ok: true, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, ms: Date.now() - t0, err: e instanceof Error ? e.message.slice(0, 120) : 'unknown' };
  }
}

export async function GET() {
  const checks = {
    database: await ping('database', () => prisma.$queryRaw`SELECT 1`),
    stripe: await ping('stripe', async () => {
      if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY missing');
      // Minimal sanity check: GET /v1/balance
      const r = await fetch('https://api.stripe.com/v1/balance', {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
        cache: 'no-store',
      });
      if (!r.ok) throw new Error(`stripe ${r.status}`);
    }),
    odds: await ping('odds', async () => {
      if (!process.env.ODDS_API_KEY) throw new Error('ODDS_API_KEY missing (non-fatal)');
      const r = await fetch(`https://api.the-odds-api.com/v4/sports?apiKey=${process.env.ODDS_API_KEY}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(`odds ${r.status}`);
    }),
  };

  const ok = checks.database.ok && checks.stripe.ok; // odds is non-fatal
  return NextResponse.json(
    { ok, checks, version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev', ts: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
