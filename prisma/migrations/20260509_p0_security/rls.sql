-- Supabase Row Level Security policies for the P0 hardening pass.
-- Apply AFTER the schema migration (`migration.sql` in this directory).
--
-- Apply manually via Supabase SQL editor or psql with the service-role
-- connection string:
--   psql "$SUPABASE_DB_URL" -f prisma/migrations/20260509_p0_security/rls.sql
--
-- Model:
--   - `auth.uid()` (Supabase JWT) maps to `Utilizator.supabaseId`. We DO NOT
--     compare against `Utilizator.id` (a Prisma cuid) — only `supabaseId`.
--   - The `service_role` key bypasses RLS automatically; backend Prisma writes
--     use that key, so the policies below only restrict direct PostgREST/
--     Supabase JS access from the browser.
--
-- Tables covered: Utilizator, Pariu, Retragere, Ledger.
-- Webhook tables (ProcessedWebhookEvent) and ContTrader/RegulaCont are NOT
-- exposed via PostgREST and stay locked down by default RLS=on with no
-- permissive policies (i.e. zero rows visible to anon / authenticated).

BEGIN;

-- ─── Utilizator ─────────────────────────────────────────────────────────
ALTER TABLE "Utilizator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Utilizator" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "utilizator_select_own"      ON "Utilizator";
DROP POLICY IF EXISTS "utilizator_update_own"      ON "Utilizator";
DROP POLICY IF EXISTS "utilizator_service_all"     ON "Utilizator";

CREATE POLICY "utilizator_select_own" ON "Utilizator"
    FOR SELECT
    TO authenticated
    USING ("supabaseId" = auth.uid()::text);

-- Limited self-update — users can edit profile fields, not statusKYC etc.
-- Backend (service_role) handles privileged updates.
CREATE POLICY "utilizator_update_own" ON "Utilizator"
    FOR UPDATE
    TO authenticated
    USING ("supabaseId" = auth.uid()::text)
    WITH CHECK ("supabaseId" = auth.uid()::text);

CREATE POLICY "utilizator_service_all" ON "Utilizator"
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ─── Pariu ──────────────────────────────────────────────────────────────
ALTER TABLE "Pariu" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pariu" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pariu_select_own"   ON "Pariu";
DROP POLICY IF EXISTS "pariu_service_all"  ON "Pariu";

CREATE POLICY "pariu_select_own" ON "Pariu"
    FOR SELECT
    TO authenticated
    USING (
        "utilizatorId" IN (
            SELECT "id" FROM "Utilizator" WHERE "supabaseId" = auth.uid()::text
        )
    );

CREATE POLICY "pariu_service_all" ON "Pariu"
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ─── Retragere (WithdrawalRequest) ──────────────────────────────────────
ALTER TABLE "Retragere" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Retragere" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "retragere_select_own"  ON "Retragere";
DROP POLICY IF EXISTS "retragere_service_all" ON "Retragere";

CREATE POLICY "retragere_select_own" ON "Retragere"
    FOR SELECT
    TO authenticated
    USING (
        "utilizatorId" IN (
            SELECT "id" FROM "Utilizator" WHERE "supabaseId" = auth.uid()::text
        )
    );

CREATE POLICY "retragere_service_all" ON "Retragere"
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ─── Ledger ─────────────────────────────────────────────────────────────
ALTER TABLE "Ledger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ledger" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ledger_select_own"  ON "Ledger";
DROP POLICY IF EXISTS "ledger_service_all" ON "Ledger";

CREATE POLICY "ledger_select_own" ON "Ledger"
    FOR SELECT
    TO authenticated
    USING (
        "utilizatorId" IN (
            SELECT "id" FROM "Utilizator" WHERE "supabaseId" = auth.uid()::text
        )
    );

-- Note: NO insert/update/delete policy for `authenticated` — even with the
-- append-only RULEs in place we want belt-and-braces enforcement that only
-- the backend can write to the ledger.
CREATE POLICY "ledger_service_all" ON "Ledger"
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ─── Anon role gets nothing on these tables ─────────────────────────────
-- ENABLE ROW LEVEL SECURITY without a policy = deny all. The anon role can
-- still hit unrestricted tables (e.g. marketing pages); financial / personal
-- tables are now opaque to anonymous traffic.

COMMIT;
