-- =============================================================================
-- P0 Security Hardening — DDL migration
--
-- This migration accompanies the Prisma schema additions for:
--   * ProcessedWebhookEvent  (Stripe/Sumsub idempotency)
--   * Ledger                 (append-only money ledger)
--   * StatusRetragere enum + idempotencyKey on Retragere
--
-- Run BEFORE applying rls.sql.
-- =============================================================================

-- 1. Enums ---------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "StatusRetragere" AS ENUM (
    'PENDING','APPROVED','PROCESSING','PAID','REJECTED','FAILED','REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "LedgerEntryType" AS ENUM (
    'WITHDRAWAL_HOLD','WITHDRAWAL_PAID','WITHDRAWAL_REFUND',
    'BET_STAKE','BET_PAYOUT',
    'CHALLENGE_PURCHASE','CHALLENGE_REFUND',
    'ADJUSTMENT'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Retragere additions -------------------------------------------------------

ALTER TABLE "Retragere"
  ADD COLUMN IF NOT EXISTS "statusEnum"     "StatusRetragere" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT,
  ADD COLUMN IF NOT EXISTS "failureReason"  TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS "Retragere_idempotencyKey_key"
  ON "Retragere"("idempotencyKey")
  WHERE "idempotencyKey" IS NOT NULL;

-- 3. Ledger -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "Ledger" (
  "id"            TEXT PRIMARY KEY,
  "utilizatorId"  TEXT NOT NULL REFERENCES "Utilizator"("id"),
  "contId"        TEXT,
  "type"          "LedgerEntryType" NOT NULL,
  "amount"        DOUBLE PRECISION NOT NULL,
  "currency"      TEXT NOT NULL DEFAULT 'EUR',
  "refType"       TEXT,
  "refId"         TEXT,
  "retragereId"   TEXT REFERENCES "Retragere"("id"),
  "metadata"      JSONB,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Ledger_utilizatorId_createdAt_idx"
  ON "Ledger"("utilizatorId","createdAt");
CREATE INDEX IF NOT EXISTS "Ledger_refType_refId_idx"
  ON "Ledger"("refType","refId");

-- Append-only enforcement. Postgres RULES silently drop UPDATE/DELETE attempts.
-- We use a RULE (not a TRIGGER raising EXCEPTION) so concurrent vacuum / Prisma
-- introspection don't fail; combined with row-level perms this is sufficient.
CREATE OR REPLACE RULE "ledger_no_update" AS
  ON UPDATE TO "Ledger" DO INSTEAD NOTHING;
CREATE OR REPLACE RULE "ledger_no_delete" AS
  ON DELETE TO "Ledger" DO INSTEAD NOTHING;

-- 4. ProcessedWebhookEvent ----------------------------------------------------

CREATE TABLE IF NOT EXISTS "ProcessedWebhookEvent" (
  "id"          TEXT PRIMARY KEY,
  "provider"    TEXT NOT NULL,
  "eventId"     TEXT NOT NULL,
  "eventType"   TEXT,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProcessedWebhookEvent_provider_eventId_key"
  ON "ProcessedWebhookEvent"("provider","eventId");
CREATE INDEX IF NOT EXISTS "ProcessedWebhookEvent_processedAt_idx"
  ON "ProcessedWebhookEvent"("processedAt");
