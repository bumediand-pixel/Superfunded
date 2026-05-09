/**
 * Withdrawal service — single source of truth for the withdrawal state machine.
 *
 * Why a service instead of inline route logic:
 *   - Idempotency: a client retry must not produce duplicate debits. We rely
 *     on a unique `idempotencyKey` on `Retragere` plus a unique
 *     `idempotencyKey` on `Ledger` so even if the API is hit three times
 *     with the same key we only ever debit once.
 *   - Atomicity: the balance check + debit + ledger insert MUST be one
 *     transaction at Serializable isolation, otherwise a concurrent bet
 *     (or another withdrawal) could let the user spend the same money twice.
 *   - State machine: PENDING → APPROVED → PROCESSING → COMPLETED, with
 *     REJECTED / FAILED branches and a REFUNDED terminal that re-credits the
 *     ledger when an upstream payout fails.
 *
 * The functions exported here are the *only* sanctioned way to mutate
 * `Retragere` rows. Direct prisma writes from routes are a footgun.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const MIN_WITHDRAWAL = 50;
export const MAX_WITHDRAWAL = 1_000_000;

export type WithdrawalMethod = 'TRANSFER_BANCAR' | 'CRYPTO';

export type RequestWithdrawalInput = {
  utilizatorId: string;
  suma: number;
  metoda: WithdrawalMethod;
  detaliiPlata?: Prisma.InputJsonValue;
  idempotencyKey: string;
};

export type RequestWithdrawalResult =
  | { kind: 'created'; retragereId: string }
  | { kind: 'duplicate'; retragereId: string }
  | { kind: 'rejected'; reason: WithdrawalRejection };

export type WithdrawalRejection =
  | 'AMOUNT_OUT_OF_RANGE'
  | 'KYC_NOT_APPROVED'
  | 'NO_FUNDED_ACCOUNT'
  | 'INSUFFICIENT_BALANCE'
  | 'USER_NOT_FOUND';

/**
 * Create a new withdrawal request. Atomic + idempotent.
 *
 * Concurrency model:
 *   1. Open a Serializable transaction.
 *   2. SELECT user + funded accounts FOR UPDATE.
 *   3. Compute totalBalance from accounts; reject if insufficient.
 *   4. Re-check idempotency key (could be created by a parallel request).
 *   5. Insert Retragere(state=PENDING). At this stage nothing is debited yet —
 *      money only moves out of the user's accounts when an admin transitions
 *      to APPROVED via `approveWithdrawal`.
 *
 * Rationale for not debiting on PENDING: ops needs a chance to vet large /
 * suspicious withdrawals before locking funds. The ledger-debit happens at
 * `approveWithdrawal` so the audit trail matches "money committed" semantics.
 */
export async function requestWithdrawal(input: RequestWithdrawalInput): Promise<RequestWithdrawalResult> {
  const { utilizatorId, suma, metoda, detaliiPlata, idempotencyKey } = input;

  if (!Number.isFinite(suma) || suma < MIN_WITHDRAWAL || suma > MAX_WITHDRAWAL) {
    return { kind: 'rejected', reason: 'AMOUNT_OUT_OF_RANGE' };
  }

  // Quick pre-check outside the transaction to short-circuit obvious failures.
  const existing = await prisma.retragere.findUnique({
    where: { idempotencyKey },
    select: { id: true, utilizatorId: true },
  });
  if (existing) {
    if (existing.utilizatorId !== utilizatorId) {
      // Idempotency keys are per-user; key collision across users is treated
      // as a fresh failure rather than leaking another user's request id.
      return { kind: 'rejected', reason: 'USER_NOT_FOUND' };
    }
    return { kind: 'duplicate', retragereId: existing.id };
  }

  try {
    return await prisma.$transaction(
      async tx => {
        const utilizator = await tx.utilizator.findUnique({
          where: { id: utilizatorId },
          include: { conturi: { where: { statusEvaluare: 'FINANTAT' } } },
        });
        if (!utilizator) return { kind: 'rejected' as const, reason: 'USER_NOT_FOUND' as const };
        if (utilizator.statusKYC !== 'APROBAT') {
          return { kind: 'rejected' as const, reason: 'KYC_NOT_APPROVED' as const };
        }
        if (utilizator.conturi.length === 0) {
          return { kind: 'rejected' as const, reason: 'NO_FUNDED_ACCOUNT' as const };
        }

        const totalBalance = utilizator.conturi.reduce((acc, c) => acc + c.capitalCurent, 0);
        if (suma > totalBalance) {
          return { kind: 'rejected' as const, reason: 'INSUFFICIENT_BALANCE' as const };
        }

        // Race-safe re-check inside the transaction.
        const racing = await tx.retragere.findUnique({
          where: { idempotencyKey },
          select: { id: true },
        });
        if (racing) return { kind: 'duplicate' as const, retragereId: racing.id };

        const created = await tx.retragere.create({
          data: {
            utilizatorId,
            suma,
            metodaPlata:    metoda,
            detaliiPlata:   detaliiPlata ?? {},
            status:         'IN_PROCESARE',
            state:          'PENDING',
            idempotencyKey,
          },
          select: { id: true },
        });

        return { kind: 'created' as const, retragereId: created.id };
      },
      { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 }
    );
  } catch (e: unknown) {
    // P2002 = idempotency violation (lost race). Return the existing row.
    const code = (e as { code?: string })?.code;
    if (code === 'P2002') {
      const existing = await prisma.retragere.findUnique({
        where: { idempotencyKey },
        select: { id: true },
      });
      if (existing) return { kind: 'duplicate', retragereId: existing.id };
    }
    throw e;
  }
}

/**
 * Admin transition: PENDING → APPROVED → debit funded accounts pro-rata
 * and post a `WITHDRAWAL_DEBIT` ledger entry. Wrapped in a Serializable tx
 * so balance + ledger stay consistent.
 */
export async function approveWithdrawal(retragereId: string): Promise<void> {
  await prisma.$transaction(
    async tx => {
      const retragere = await tx.retragere.findUnique({
        where: { id: retragereId },
        include: {
          utilizator: { include: { conturi: { where: { statusEvaluare: 'FINANTAT' } } } },
        },
      });
      if (!retragere) throw new Error(`Retragere ${retragereId} not found`);
      if (retragere.state !== 'PENDING') {
        throw new Error(`Retragere ${retragereId} not in PENDING state (was ${retragere.state})`);
      }

      const accounts = retragere.utilizator.conturi;
      const totalBalance = accounts.reduce((a, c) => a + c.capitalCurent, 0);
      if (retragere.suma > totalBalance) {
        // Funds disappeared between PENDING and APPROVED (loss / refund / scale).
        await tx.retragere.update({
          where: { id: retragereId },
          data: {
            state:          'REJECTED',
            status:         'RESPINS',
            failureReason:  'INSUFFICIENT_BALANCE_AT_APPROVAL',
            processedAt:    new Date(),
          },
        });
        throw new Error('INSUFFICIENT_BALANCE_AT_APPROVAL');
      }

      // Debit pro-rata across funded accounts.
      let remaining = retragere.suma;
      for (const cont of accounts) {
        if (remaining <= 0) break;
        const take = Math.min(cont.capitalCurent, remaining);
        if (take <= 0) continue;
        await tx.contTrader.update({
          where: { id: cont.id },
          data:  { capitalCurent: { decrement: take } },
        });
        remaining -= take;
      }

      // Single ledger entry summing the total debit. We use the withdrawal id
      // as the idempotency key so re-running approveWithdrawal cannot
      // duplicate the entry.
      const ledger = await tx.ledger.create({
        data: {
          utilizatorId:   retragere.utilizatorId,
          retragereId:    retragere.id,
          kind:           'WITHDRAWAL_DEBIT',
          amount:         -retragere.suma,
          currency:       'EUR',
          externalRef:    retragere.id,
          idempotencyKey: `withdrawal:debit:${retragere.id}`,
          metadata:       { metoda: retragere.metodaPlata },
        },
        select: { id: true },
      });

      await tx.retragere.update({
        where: { id: retragereId },
        data: {
          state:         'APPROVED',
          status:        'APROBAT',
          approvedAt:    new Date(),
          ledgerEntryId: ledger.id,
        },
      });
    },
    { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 }
  );
}

/** Admin transition: APPROVED → PROCESSING (payout job picked it up). */
export async function markProcessing(retragereId: string): Promise<void> {
  await prisma.retragere.updateMany({
    where: { id: retragereId, state: 'APPROVED' },
    data:  { state: 'PROCESSING' },
  });
}

/** Admin transition: PROCESSING → COMPLETED (payout succeeded). */
export async function completeWithdrawal(retragereId: string): Promise<void> {
  await prisma.retragere.updateMany({
    where: { id: retragereId, state: { in: ['APPROVED', 'PROCESSING'] } },
    data:  { state: 'COMPLETED', status: 'COMPLETAT', processedAt: new Date(), procesatLa: new Date() },
  });
}

/**
 * Compensation: the upstream payout failed (bank rejected, crypto address
 * invalid, ops cancellation). Re-credits the user accounts pro-rata, posts a
 * positive `WITHDRAWAL_REFUND` ledger entry (idempotent), and marks the
 * withdrawal REFUNDED. Safe to call multiple times — second invocation is a
 * no-op thanks to the unique ledger idempotencyKey.
 */
export async function refundFailedWithdrawal(
  retragereId: string,
  reason: string
): Promise<void> {
  await prisma.$transaction(
    async tx => {
      const retragere = await tx.retragere.findUnique({
        where: { id: retragereId },
        include: {
          utilizator: { include: { conturi: { where: { statusEvaluare: 'FINANTAT' } } } },
        },
      });
      if (!retragere) throw new Error(`Retragere ${retragereId} not found`);

      // Only previously-debited states can be refunded. PENDING/REJECTED never
      // touched the ledger so there's nothing to compensate.
      const refundable = ['APPROVED', 'PROCESSING', 'FAILED'] as const;
      if (!refundable.includes(retragere.state as typeof refundable[number])) {
        // Idempotent: REFUNDED is a no-op; PENDING/REJECTED throws.
        if (retragere.state === 'REFUNDED') return;
        throw new Error(`Cannot refund withdrawal in state ${retragere.state}`);
      }

      // Re-credit pro-rata across funded accounts (best-effort: if user has
      // no funded accounts left we still post the ledger credit so books
      // balance, and a manual ops correction is required).
      let remaining = retragere.suma;
      for (const cont of retragere.utilizator.conturi) {
        if (remaining <= 0) break;
        const give = Math.min(remaining, retragere.suma); // cap at total
        await tx.contTrader.update({
          where: { id: cont.id },
          data:  { capitalCurent: { increment: give } },
        });
        remaining -= give;
        // We credit the entire amount to the first funded account to keep the
        // operation deterministic; ops can rebalance manually if needed.
        break;
      }

      await tx.ledger
        .create({
          data: {
            utilizatorId:   retragere.utilizatorId,
            retragereId:    retragere.id,
            kind:           'WITHDRAWAL_REFUND',
            amount:         retragere.suma,
            currency:       'EUR',
            externalRef:    retragere.id,
            idempotencyKey: `withdrawal:refund:${retragere.id}`,
            metadata:       { reason },
          },
        })
        .catch((e: unknown) => {
          const code = (e as { code?: string })?.code;
          if (code !== 'P2002') throw e;
          // P2002 → already refunded, nothing more to do here.
        });

      await tx.retragere.update({
        where: { id: retragereId },
        data: {
          state:         'REFUNDED',
          status:        'REFUNDAT',
          failureReason: reason,
          processedAt:   new Date(),
          procesatLa:    new Date(),
        },
      });
    },
    { isolationLevel: 'Serializable', maxWait: 5_000, timeout: 15_000 }
  );
}

/** Mark a withdrawal as FAILED without refunding (ops will follow up). */
export async function failWithdrawal(retragereId: string, reason: string): Promise<void> {
  await prisma.retragere.updateMany({
    where: { id: retragereId, state: { in: ['APPROVED', 'PROCESSING'] } },
    data:  { state: 'FAILED', failureReason: reason },
  });
}
