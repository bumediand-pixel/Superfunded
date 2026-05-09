-- =============================================================================
-- P0 Security Hardening — Supabase Row-Level Security policies
--
-- Run AFTER migration.sql. Apply via Supabase SQL editor or:
--   psql "$DIRECT_URL" -f prisma/migrations/20260509_p0_security/rls.sql
--
-- Strategy:
--   * Enable RLS on every table that holds user-owned PII or money.
--   * SELECT-own policy keyed on auth.uid()  ->  Utilizator.supabaseId.
--   * service_role bypasses RLS automatically (Supabase default).
--   * No INSERT/UPDATE/DELETE policies for anon/authenticated — those mutations
--     MUST go through our server actions / API routes which use the service_role
--     connection. This is defence-in-depth: even if someone leaks the anon key,
--     they cannot tamper with money tables.
-- =============================================================================

-- Helper: resolve the Utilizator.id for the current Supabase session.
-- SECURITY DEFINER so it can read Utilizator regardless of caller's RLS.
CREATE OR REPLACE FUNCTION public.current_utilizator_id()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id
  FROM "Utilizator" u
  WHERE u."supabaseId" = auth.uid()::text
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_utilizator_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_utilizator_id() TO authenticated, service_role;

-- ──────────────────────────────────────────────────────────────────────────────
-- Utilizator
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Utilizator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Utilizator" FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "utilizator_select_own"     ON "Utilizator";
DROP POLICY IF EXISTS "utilizator_service_all"    ON "Utilizator";

CREATE POLICY "utilizator_select_own" ON "Utilizator"
  FOR SELECT TO authenticated
  USING ("supabaseId" = auth.uid()::text);

CREATE POLICY "utilizator_service_all" ON "Utilizator"
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- Pariu
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Pariu" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pariu" FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pariu_select_own"  ON "Pariu";
DROP POLICY IF EXISTS "pariu_service_all" ON "Pariu";

CREATE POLICY "pariu_select_own" ON "Pariu"
  FOR SELECT TO authenticated
  USING ("utilizatorId" = public.current_utilizator_id());

CREATE POLICY "pariu_service_all" ON "Pariu"
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- Retragere (WithdrawalRequest)
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Retragere" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Retragere" FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "retragere_select_own"  ON "Retragere";
DROP POLICY IF EXISTS "retragere_service_all" ON "Retragere";

CREATE POLICY "retragere_select_own" ON "Retragere"
  FOR SELECT TO authenticated
  USING ("utilizatorId" = public.current_utilizator_id());

CREATE POLICY "retragere_service_all" ON "Retragere"
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────────────────────
-- Ledger — append-only; even SELECT is owner-only.
-- Inserts ONLY via service_role (server-side). RULES on the table block UPDATE/DELETE.
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Ledger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ledger" FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ledger_select_own"  ON "Ledger";
DROP POLICY IF EXISTS "ledger_service_all" ON "Ledger";

CREATE POLICY "ledger_select_own" ON "Ledger"
  FOR SELECT TO authenticated
  USING ("utilizatorId" = public.current_utilizator_id());

CREATE POLICY "ledger_service_all" ON "Ledger"
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
