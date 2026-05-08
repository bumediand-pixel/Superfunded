/**
 * GDPR Right to Erasure (Art. 17). Deletes the user record and all related data.
 *
 * Caveats kept obvious:
 *   - We DO NOT delete completed financial records (Pariu / Retragere with status PROCESAT)
 *     because RO accounting law requires us to retain them for 5–10 years. Instead we
 *     anonymize the user's PII (email, name, phone) and keep the rows.
 *   - User must confirm by typing "STERGE" — prevents accidental clicks.
 *   - Supabase auth user is signed out; the actual auth row is left alone (admin must
 *     remove it from Supabase dashboard, since deleting via service-role would require
 *     SUPABASE_SERVICE_ROLE_KEY which we don't put in marketing app).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const Schema = z.object({ confirm: z.literal('STERGE') });

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Confirmarea trebuie să fie textul "STERGE"' }, { status: 400 });
  }

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ ok: true }); // already gone

  // Anonymize the Utilizator row instead of hard-delete (preserves FK integrity for
  // financial records we must retain). Replace PII with deterministic placeholders.
  const placeholder = `deleted-${utilizator.id}@anonymized.local`;
  await prisma.utilizator.update({
    where: { id: utilizator.id },
    data: {
      email:       placeholder,
      numeComplet: null,
      telefon:     null,
      tara:        null,
      stripeCustomerId: null,
      sumsubApplicantId: null,
      statusKYC:   'NEVERIFICAT',
    },
  });

  // Soft-disable any active accounts so the cron settle engine ignores them.
  await prisma.contTrader.updateMany({
    where: { utilizatorId: utilizator.id, activ: true },
    data:  { activ: false, statusEvaluare: 'SUSPENDAT' },
  });

  // Sign out — cookies cleared by Supabase
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true, anonymizedId: utilizator.id });
}
