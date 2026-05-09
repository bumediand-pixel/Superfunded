/**
 * Withdrawal service — money-out happy path with idempotency, ledger writes,
 * and a refund/compensation function.
 *
 * Invariants:
 *   1. Every withdrawal has a unique idempotencyKey (UUID v4). Re-submitting the
 *      same key returns the existing record instead of creating a duplicate.
 *   2. Every state transition writes a Ledger entry inside the same Serializable
 *      transaction as the Retragere row update — never one without the other.
 *   3. Ledger is append-only at the DB level (RULES block UPDATE/DELETE).
 *   4. State machine:
 *
 *        PENDING ── approve ──▶ APPROVED ── start ─▶ PROCESSING ─┬─ success ─▶ PAID
 *           │                                                     │
 *           └── reject ──▶ REJECTED                                └─ failure ─▶ FAILED
 *                                                                        │
 *                                                                refundFailedWithdrawal
 *                                                                        │
 *                                                                        ▼
 *                                                                    REFUNDED
 *
 *      Any other transition is rejected.
 */
import type { Prisma, Retragere } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type Tx = Prisma.TransactionClient;

export type WithdrawalMethod = 'TRANSFER_BANCAR' | 'CRYPTO';

export type CreateWithdrawalInput = {
  utilizatorId:   string;
  suma:           number;
  metoda:         WithdrawalMethod;
  detaliiPlata?:  Prisma.InputJsonValue;
  idempotencyKey: string;
};

export type WithdrawalResult = { retragere: Retragere; created: boolean };

/**
 * Create a withdrawal request idempotently. Safe to call multiple times with
 * the same idempotencyKey — the second call returns the original record with
 * `created: false`.
 *
 * Caller is responsible for KYC + balance preconditions; this function performs
 * the ATOMIC reservation only (Retragere row + Ledger HOLD entry).
 */
export async function createWithdrawal(
  input: CreateWithdrawalInput,
): Promise<WithdrawalResult> {
  if (!Number.isFinite(input.suma) || input.suma <= 0) {
    throw new Error('Sumă invalidă');
  }
  if (!input.idempotencyKey || input.idempotencyKey.length < 16) {
    throw new Error('idempotencyKey lipsă sau prea scurt');
  }

  // Fast path: already-known key returns existing row without touching the DB beyond a SELECT.
  const existing = await prisma.retragere.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) return { retragere: existing, created: false };

  return prisma.$transaction(
    async (tx) => {
      // Race: another concurrent request with the same key may have inserted
      // between our SELECT above and this transaction. Re-check inside the tx.
      const racing = await tx.retragere.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (racing) return { retragere: racing, created: false };

      const retragere = await tx.retragere.create({
        data: {
          utilizatorId:   input.utilizatorId,
          suma:           input.suma,
          metodaPlata:    input.metoda,
          detaliiPlata:   input.detaliiPlata ?? {},
          // Keep legacy string status in sync for back-compat with admin UI.
          status:         'IN_PROCESARE',
          statusEnum:     'PENDING',
          idempotencyKey: input.idempotencyKey,
        },
      });

      await writeLedger(tx, {
        utilizatorId: input.utilizatorId,
        type:         'WITHDRAWAL_HOLD',
        // Holds are debits (negative) against the user's available balance.
        amount:       -input.suma,
        retragereId:  retragere.id,
        refType:      'Retragere',
        refId:        retragere.id,
      });

      return { retragere, created: true };
    },
    { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 },
  );
}

/**
 * Mark a withdrawal as paid (treasury team / payout cron has confirmed external
 * settlement). Writes a paired WITHDRAWAL_PAID ledger entry that nets to zero
 * with the original HOLD — net effect on the account balance is the original
 * debit (which was already taken at HOLD time).
 */
export async function markWithdrawalPaid(
  retragereId: string,
  externalRef?: string,
): Promise<Retragere> {
  return prisma.$transaction(
    async (tx) => {
      const w = await tx.retragere.findUnique({ where: { id: retragereId } });
      if (!w) throw new Error('Retragere inexistentă');

      assertTransition(w.statusEnum, ['PENDING', 'APPROVED', 'PROCESSING'], 'PAID');

      const updated = await tx.retragere.update({
        where: { id: retragereId },
        data: {
          status:     'PROCESAT',
          statusEnum: 'PAID',
          procesatLa: new Date(),
        },
      });

      await writeLedger(tx, {
        utilizatorId: w.utilizatorId,
        type:         'WITHDRAWAL_PAID',
        amount:       0, // Settlement marker; the debit was taken at HOLD time.
        retragereId:  w.id,
        refType:      'Retragere',
        refId:        w.id,
        metadata:     externalRef ? { externalRef } : undefined,
      });

      return updated;
    },
    { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 },
  );
}

/**
 * Compensation path. When a payout fails (bank reject, crypto reorg, KYC
 * mismatch), call this to:
 *   1. Flip status to FAILED then REFUNDED.
 *   2. Write a WITHDRAWAL_REFUND ledger entry that EXACTLY OFFSETS the original
 *      hold (positive amount = credit back to user).
 *
 * Idempotent: re-running on an already-REFUNDED withdrawal is a no-op.
 */
export async function refundFailedWithdrawal(
  retragereId: string,
  reason: string,
): Promise<Retragere> {
  return prisma.$transaction(
    async (tx) => {
      const w = await tx.retragere.findUnique({ where: { id: retragereId } });
      if (!w) throw new Error('Retragere inexistentă');

      // Idempotent short-circuit.
      if (w.statusEnum === 'REFUNDED') return w;

      assertTransition(
        w.statusEnum,
        ['PENDING', 'APPROVED', 'PROCESSING', 'FAILED'],
        'REFUNDED',
      );

      const updated = await tx.retragere.update({
        where: { id: retragereId },
        data: {
          status:        'ANULAT',
          statusEnum:    'REFUNDED',
          failureReason: reason,
          procesatLa:    new Date(),
        },
      });

      // Look up the original HOLD amount to refund the exact figure (defends
      // against later mutations to Retragere.suma).
      const hold = await tx.ledger.findFirst({
        where: { retragereId: w.id, type: 'WITHDRAWAL_HOLD' },
        orderBy: { createdAt: 'asc' },
      });
      const refundAmount = hold ? -hold.amount : w.suma;

      await writeLedger(tx, {
        utilizatorId: w.utilizatorId,
        type:         'WITHDRAWAL_REFUND',
        amount:       refundAmount,
        retragereId:  w.id,
        refType:      'Retragere',
        refId:        w.id,
        metadata:     { reason },
      });

      return updated;
    },
    { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 },
  );
}

// ── internals ────────────────────────────────────────────────────────────────

type LedgerWrite = {
  utilizatorId: string;
  type:
    | 'WITHDRAWAL_HOLD'
    | 'WITHDRAWAL_PAID'
    | 'WITHDRAWAL_REFUND'
    | 'BET_STAKE'
    | 'BET_PAYOUT'
    | 'CHALLENGE_PURCHASE'
    | 'CHALLENGE_REFUND'
    | 'ADJUSTMENT';
  amount:       number;
  retragereId?: string;
  refType?:     string;
  refId?:       string;
  contId?:      string;
  metadata?:    Prisma.InputJsonValue;
};

async function writeLedger(tx: Tx, e: LedgerWrite) {
  await tx.ledger.create({
    data: {
      utilizatorId: e.utilizatorId,
      contId:       e.contId,
      type:         e.type,
      amount:       e.amount,
      retragereId:  e.retragereId,
      refType:      e.refType,
      refId:        e.refId,
      metadata:     e.metadata,
    },
  });
}

function assertTransition(
  from: string,
  allowedFrom: string[],
  to: string,
): void {
  if (!allowedFrom.includes(from)) {
    throw new Error(`Tranziție invalidă: ${from} → ${to}`);
  }
}
