/**
 * GET /api/pariuri/export — CSV download of the user's full bet history.
 * Used both as a UX nicety (download to spreadsheet) and as the GDPR Art. 20
 * data-portability response for the betting domain.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const HEADERS = [
  'id', 'data', 'sport', 'eveniment', 'piata', 'selectie',
  'cota', 'suma', 'potentialCastig', 'tipPariu',
  'status', 'profit_pierdere', 'data_rezultat',
] as const;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator' }, { status: 404 });

  const bets = await prisma.pariu.findMany({
    where: { utilizatorId: utilizator.id },
    orderBy: { dataPariu: 'desc' },
  });

  const rows: string[] = [HEADERS.join(',')];
  for (const b of bets) {
    rows.push([
      b.id,
      b.dataPariu.toISOString(),
      b.sport,
      b.eveniment,
      b.piata,
      b.selectie,
      b.cota,
      b.suma,
      b.potentialCastig,
      b.tipPariu,
      b.statusPariu,
      b.castigSauPierdere ?? '',
      b.dataRezultat?.toISOString() ?? '',
    ].map(csvEscape).join(','));
  }

  const csv = rows.join('\n');
  const filename = `superfunded-pariuri-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
