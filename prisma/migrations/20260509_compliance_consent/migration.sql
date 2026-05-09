-- Migration: compliance_consent
-- Created: 2026-05-09
-- Adds the `Consent` table that backs /api/consent. One row is appended per
-- consent change. ANSPDCP guidance: consent must be demonstrable, with
-- timestamp, IP and user agent retained for the duration of the consent.
--
-- Apply manually after PR review:
--   psql "$DATABASE_URL" -f prisma/migrations/20260509_compliance_consent/migration.sql
-- This file is intentionally NOT auto-applied — see the launch-roadmap doc.

CREATE TABLE IF NOT EXISTS "Consent" (
    "id"         TEXT        NOT NULL,
    "userId"     TEXT,
    "sessionId"  TEXT        NOT NULL,
    "necessary"  BOOLEAN     NOT NULL DEFAULT true,
    "analytics"  BOOLEAN     NOT NULL DEFAULT false,
    "marketing"  BOOLEAN     NOT NULL DEFAULT false,
    "version"    INTEGER     NOT NULL DEFAULT 1,
    "ip"         TEXT,
    "userAgent"  TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Consent_userId_version_idx"    ON "Consent"("userId", "version");
CREATE INDEX IF NOT EXISTS "Consent_sessionId_version_idx" ON "Consent"("sessionId", "version");
CREATE INDEX IF NOT EXISTS "Consent_createdAt_idx"         ON "Consent"("createdAt");
