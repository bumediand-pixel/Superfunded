/**
 * GDPR Article 20 — Data Portability.
 *
 * Returns a single ZIP-friendly JSON document with everything we store on the user.
 * This is the structured response complementing /api/pariuri/export (CSV) — gives
 * one combined snapshot of profile, accounts, bets, withdrawals, affiliate state.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const utilizator = await prisma.utilizator.findUnique({
    where: { supabaseId: user.id },
    include: {
      conturi: { include: { reguli: true } },
      pariuri: true,
      retrageri: true,
      afiliat: { include: { comisioane: true } },
    },
  });
  if (!utilizator) return NextResponse.json({ error: 'Nu ești înregistrat' }, { status: 404 });

  const exportPayload = {
    exportType: 'GDPR Article 20 — Data Portability',
    exportedAt: new Date().toISOString(),
    operator: {
      name: 'SuperFunded SRL',
      country: 'România',
      contact: 'gdpr@thesuperfunded.com',
    },
    profile: {
      id: utilizator.id,
      email: utilizator.email,
      numeComplet: utilizator.numeComplet,
      telefon: utilizator.telefon,
      tara: utilizator.tara,
      dataInregistrare: utilizator.dataInregistrare,
      statusKYC: utilizator.statusKYC,
    },
    auth: {
      supabaseId: utilizator.supabaseId,
      stripeCustomerId: utilizator.stripeCustomerId,
      sumsubApplicantId: utilizator.sumsubApplicantId,
    },
    conturi: utilizator.conturi,
    pariuri: utilizator.pariuri,
    retrageri: utilizator.retrageri,
    afiliat: utilizator.afiliat,
    note:
      'Documentele KYC (acte de identitate, selfie) sunt stocate la Sumsub conform AML și pot fi cerute prin gdpr@thesuperfunded.com. ' +
      'Logurile de plată complete sunt deținute de Stripe și disponibile la cerere.',
  };

  const filename = `superfunded-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
