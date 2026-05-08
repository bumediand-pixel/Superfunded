/**
 * Auth helpers — Supabase user + auto-mirrored Prisma Utilizator row.
 *
 * Why this exists: Supabase manages auth in its own tables, but our domain
 * data (accounts, picks, withdrawals, affiliates) lives in Prisma, joined to a
 * `Utilizator` row. When a user signs up via Supabase, we need to mirror
 * a Utilizator record so every other API route works.
 *
 * Old flow only created the Utilizator row inside the Stripe webhook
 * (handleCheckoutCompleted) — meaning users who registered but hadn't paid
 * couldn't enroll as affiliate, set up KYC, etc. This helper closes that gap
 * by upserting a Utilizator on first call.
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { User } from '@supabase/supabase-js';

export async function getSupabaseUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch { /* server components can't mutate cookies */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Ensure a `Utilizator` row exists for this Supabase user. Idempotent — returns
 * the existing record on subsequent calls. Use this in every route handler
 * that touches Prisma data instead of throwing 404 on missing user.
 */
export async function ensureUtilizator(user: User) {
  const numeComplet = (user.user_metadata?.full_name as string | undefined) ?? null;

  return prisma.utilizator.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      supabaseId: user.id,
      email: user.email ?? `${user.id}@unknown.local`,
      numeComplet,
      tara: 'RO',
    },
  });
}

/** Combined helper: returns both the Supabase user and the mirrored Prisma row. */
export async function getCurrentUser() {
  const user = await getSupabaseUser();
  if (!user) return null;
  const utilizator = await ensureUtilizator(user);
  return { user, utilizator };
}
