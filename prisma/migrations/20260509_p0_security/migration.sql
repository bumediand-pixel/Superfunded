-- Migration: p0_security
-- Created: 2026-05-09
-- Adds:
--   1. WithdrawalState enum + extra columns on Retragere (idempotency, state machine)
--   2. Ledger table — append-only via SQL RULE blocking UPDATE/DELETE
--   3. ProcessedWebhookEvent table — webhook idempotency
--
-- Apply manually after PR review (matches the project convention from
-- 20260509_compliance_consent/migration.sql):
--   psql "$DATABASE_URL" -f prisma/migrations/20260509_p0_security/migration.sql
--
-- The companion file `rls.sql` enables Supabase Row Level Security and is
-- applied separately because RLS only makes sense once the schema is in place.

BEGIN;

-- 1. Withdrawal state machine ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WithdrawalState') THEN
    CREATE TYPE "WithdrawalState" AS ENUM (
      'PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED',
      'REJECTED', 'FAILED', 'REFUNDED'
    );
  END IF;
END $$;

ALTER TABLE "Retragere"
    ADD COLUMN IF NOT EXISTS "state"          "WithdrawalState" NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
    ADD COLUMN IF NOT EXISTS "ledgerEntryId"  TEXT,
    ADD COLUMN IF NOT EXISTS "failureReason"  TEXT,
    ADD COLUMN IF NOT EXISTS "approvedAt"     TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "processedAt"    TIMESTAMP(3);

-- Idempotency keys must be unique across all withdrawals.
CREATE UNIQUE INDEX IF NOT EXISTS "Retragere_idempotencyKey_key"
    ON "Retragere"("idempotencyKey")
    WHERE "idempotencyKey" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Retragere_ledgerEntryId_key"
    ON "Retragere"("ledgerEntryId")
    WHERE "ledgerEntryId" IS NOT NULL;

-- 2. Ledger ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Ledger" (
    "id"             TEXT         NOT NULL,
    "utilizatorId"   TEXT         NOT NULL,
    "contId"         TEXT,
    "retragereId"    TEXT,
    "kind"           TEXT         NOT NULL,
    "amount"         DOUBLE PRECISION NOT NULL,
    "currency"       TEXT         NOT NULL DEFAULT 'EUR',
    "externalRef"    TEXT,
    "idempotencyKey" TEXT,
    "metadata"       JSONB,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Ledger_retragereId_fkey"
        FOREIGN KEY ("retragereId") REFERENCES "Retragere"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Ledger_idempotencyKey_key"
    ON "Ledger"("idempotencyKey")
    WHERE "idempotencyKey" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "Ledger_utilizatorId_createdAt_idx"
    ON "Ledger"("utilizatorId", "createdAt");

CREATE INDEX IF NOT EXISTS "Ledger_contId_createdAt_idx"
    ON "Ledger"("contId", "createdAt");

CREATE INDEX IF NOT EXISTS "Ledger_retragereId_idx"
    ON "Ledger"("retragereId");

-- Append-only enforcement via RULEs. UPDATE / DELETE are silently no-op'd
-- (`DO INSTEAD NOTHING`) so application bugs cannot rewrite financial history.
-- Service role still has the ability to drop these rules in an emergency,
-- but everyday transactions cannot mutate the ledger.
DROP RULE IF EXISTS "ledger_no_update" ON "Ledger";
CREATE RULE "ledger_no_update" AS ON UPDATE TO "Ledger" DO INSTEAD NOTHING;

DROP RULE IF EXISTS "ledger_no_delete" ON "Ledger";
CREATE RULE "ledger_no_delete" AS ON DELETE TO "Ledger" DO INSTEAD NOTHING;

-- 3. ProcessedWebhookEvent ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ProcessedWebhookEvent" (
    "id"          TEXT         NOT NULL,
    "provider"    TEXT         NOT NULL,
    "eventId"     TEXT         NOT NULL,
    "eventType"   TEXT,
    "payloadHash" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProcessedWebhookEvent_provider_processedAt_idx"
    ON "ProcessedWebhookEvent"("provider", "processedAt");

COMMIT;
