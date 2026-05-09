import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit, rateLimitHeaders } from '@/lib/ratelimit';
import { sendRetragereCeruta, sendAdminWithdrawalAlert } from '@/lib/email';
import { requestWithdrawal } from '@/lib/services/withdrawals';

/**
 * Withdrawal request endpoint.
 *
 *   - GET: returns the caller's withdrawal history.
 *   - POST: creates a new withdrawal in PENDING state through the
 *     hardened service (atomic balance check, idempotent retries).
 *
 * Per-user rate limit: 3 withdrawals / hour. Identifier is the Supabase
 * user id (NOT the IP) so a customer behind a NAT can't be locked out by
 * someone else's traffic, and a single user can't bypass the limit by
 * rotating IPs.
 */
const WithdrawalSchema = z.object({
  suma: z.number().min(50).max(1_000_000),
  metoda: z.enum(['TRANSFER_BANCAR', 'CRYPTO']),
  detaliiPlata: z.record(z.string(), z.unknown()).optional(),
});

const REJECTION_MESSAGES: Record<string, { ro: string; status: number }> = {
  AMOUNT_OUT_OF_RANGE:  { ro: 'Sumă invalidă',                    status: 400 },
  KYC_NOT_APPROVED:     { ro: 'KYC neaprobat',                    status: 400 },
  NO_FUNDED_ACCOUNT:    { ro: 'Niciun cont finanțat activ',       status: 400 },
  INSUFFICIENT_BALANCE: { ro: 'Sold insuficient',                 status: 400 },
  USER_NOT_FOUND:       { ro: 'Utilizator negăsit',               status: 404 },
};

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const retrageri = await prisma.retragere.findMany({
    where: { utilizatorId: session.utilizator.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ retrageri });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  // Per-user rate limit (3 / hour). The proxy already enforces a coarser
  // IP-based default cap on /api/*; this is the strict per-user policy.
  const rl = await rateLimit('retrageri', `user:${session.utilizator.id}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Prea multe cereri. Reîncearcă mai târziu.' },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  let json: unknown;
  try { json = await req.json(); }
  catch { return NextResponse.json({ error: 'JSON invalid' }, { status: 400 }); }

  const parsed = WithdrawalSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Date invalide', details: parsed.error.flatten() },
      { status: 400, headers: rateLimitHeaders(rl) }
    );
  }
  const { suma, metoda, detaliiPlata } = parsed.data;

  // Idempotency key: prefer the client header (correct retry behavior). If
  // missing, derive a key from (user, amount, method, minute-bucket) so a
  // double-click within the same minute still dedupes.
  const headerKey = req.headers.get('idempotency-key');
  const idempotencyKey = headerKey?.trim()
    ? `user:${session.utilizator.id}:${headerKey.trim()}`
    : `user:${session.utilizator.id}:${metoda}:${suma}:${Math.floor(Date.now() / 60_000)}`;

  const result = await requestWithdrawal({
    utilizatorId:   session.utilizator.id,
    suma,
    metoda,
    detaliiPlata:  (detaliiPlata ?? {}) as Prisma.InputJsonValue,
    idempotencyKey,
  });

  if (result.kind === 'rejected') {
    const meta = REJECTION_MESSAGES[result.reason] ?? { ro: 'Cerere respinsă', status: 400 };
    return NextResponse.json(
      { error: meta.ro, code: result.reason },
      { status: meta.status, headers: rateLimitHeaders(rl) }
    );
  }

  const retragere = await prisma.retragere.findUnique({ where: { id: result.retragereId } });

  // Fire-and-forget notifications — only on first creation, not on duplicate.
  if (result.kind === 'created') {
    sendRetragereCeruta(session.utilizator.email, suma, metoda).catch(err =>
      console.error('[retrageri] user email failed:', err)
    );
    sendAdminWithdrawalAlert(suma, metoda, session.utilizator.email).catch(err =>
      console.error('[retrageri] admin email failed:', err)
    );
  }

  return NextResponse.json(
    { retragere, idempotent: result.kind === 'duplicate' },
    { status: result.kind === 'created' ? 201 : 200, headers: rateLimitHeaders(rl) }
  );
}
