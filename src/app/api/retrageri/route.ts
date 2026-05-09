import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { check, limiters, rateLimitHeaders } from '@/lib/ratelimit';
import { sendRetragereCeruta, sendAdminWithdrawalAlert } from '@/lib/email';
import { ensureUtilizator, getSupabaseUser } from '@/lib/auth';
import { createWithdrawal } from '@/lib/services/withdrawals';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const WithdrawalSchema = z.object({
  suma: z.number().min(50).max(1_000_000),
  metoda: z.enum(['TRANSFER_BANCAR', 'CRYPTO']),
  /** Optional client-supplied UUID — if absent we generate one server-side. */
  idempotencyKey: z.string().uuid().optional(),
});

export async function GET() {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const utilizator = await ensureUtilizator(user);

  const retrageri = await prisma.retragere.findMany({
    where: { utilizatorId: utilizator.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ retrageri });
}

export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  // Per-user rate limit — 3/hour. Strict because this is a money-out endpoint.
  const decision = await check(limiters.withdrawals, `user:${user.id}`);
  if (!decision.success) {
    return NextResponse.json(
      { error: 'Prea multe cereri. Limita este 3 retrageri pe oră.' },
      { status: 429, headers: rateLimitHeaders(decision) },
    );
  }

  // Honour an Idempotency-Key header (RFC-style) if present, else fall back to
  // the JSON body field, else generate one. The first two paths let the client
  // safely retry a network failure without double-creating a withdrawal.
  const headerKey = req.headers.get('idempotency-key');

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }
  const parsed = WithdrawalSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 });
  }
  const { suma, metoda } = parsed.data;
  const idempotencyKey = (headerKey && /^[0-9a-fA-F-]{16,64}$/.test(headerKey))
    ? headerKey
    : (parsed.data.idempotencyKey ?? randomUUID());

  await ensureUtilizator(user);
  const utilizator = await prisma.utilizator.findUnique({
    where: { supabaseId: user.id },
    include: { conturi: { where: { statusEvaluare: 'FINANTAT' } } },
  });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });
  if (utilizator.statusKYC !== 'APROBAT') return NextResponse.json({ error: 'KYC neaprobat' }, { status: 400 });
  if (!utilizator.conturi.length) return NextResponse.json({ error: 'Niciun cont finanțat activ' }, { status: 400 });

  // Verify sufficient balance across funded accounts
  const totalBalance = utilizator.conturi.reduce((acc, c) => acc + c.capitalCurent, 0);
  if (suma > totalBalance) return NextResponse.json({ error: 'Sold insuficient' }, { status: 400 });

  // Service handles the atomic Retragere + Ledger HOLD insert under Serializable.
  const { retragere, created } = await createWithdrawal({
    utilizatorId: utilizator.id,
    suma,
    metoda,
    idempotencyKey,
  });

  // Only fire emails on the FIRST creation — replays of the same idempotencyKey
  // must not spam users / admins.
  if (created) {
    sendRetragereCeruta(utilizator.email, suma, metoda).catch(err =>
      console.error('[retrageri] user email failed:', err)
    );
    sendAdminWithdrawalAlert(suma, metoda, utilizator.email).catch(err =>
      console.error('[retrageri] admin email failed:', err)
    );
  }

  return NextResponse.json({ retragere, idempotencyKey, replay: !created });
}
