import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const PeriodSchema = z.enum(['7d', '30d', 'all']).catch('30d');

async function getSupabaseUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const period = PeriodSchema.parse(req.nextUrl.searchParams.get('period'));
  const dateFilter = period === '7d'
    ? new Date(Date.now() - 7 * 86400000)
    : period === '30d'
    ? new Date(Date.now() - 30 * 86400000)
    : new Date(0);

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ stats: null });

  const pariuri = await prisma.pariu.findMany({
    where: { utilizatorId: utilizator.id, dataPariu: { gte: dateFilter } },
    orderBy: { dataPariu: 'asc' },
  });

  const total = pariuri.length;
  const castigate = pariuri.filter(p => p.statusPariu === 'CASTIGAT').length;
  const inchise = pariuri.filter(p => ['CASTIGAT', 'PIERDUT', 'JUMATATE_CASTIG'].includes(p.statusPariu));

  const profitNet = inchise.reduce((acc, p) => acc + (p.castigSauPierdere ?? 0), 0);
  const rataWin = inchise.length > 0 ? ((castigate / inchise.length) * 100).toFixed(1) : null;
  const roi = inchise.length > 0 && inchise.reduce((a, p) => a + p.suma, 0) > 0
    ? ((profitNet / inchise.reduce((a, p) => a + p.suma, 0)) * 100).toFixed(1)
    : null;
  const cotaMedie = total > 0
    ? (pariuri.reduce((a, p) => a + p.cota, 0) / total).toFixed(2)
    : null;

  // Win streak
  let maxStreak = 0;
  let streak = 0;
  for (const p of inchise) {
    if (p.statusPariu === 'CASTIGAT') { streak++; maxStreak = Math.max(maxStreak, streak); }
    else streak = 0;
  }

  // Per-sport breakdown
  const sportMap: Record<string, { total: number; castigate: number }> = {};
  for (const p of pariuri) {
    if (!sportMap[p.sport]) sportMap[p.sport] = { total: 0, castigate: 0 };
    sportMap[p.sport].total++;
    if (p.statusPariu === 'CASTIGAT') sportMap[p.sport].castigate++;
  }
  const perSport = Object.entries(sportMap)
    .map(([sport, { total: t, castigate: c }]) => ({ sport, total: t, castigate: c, pct: Math.round((t / total) * 100) }))
    .sort((a, b) => b.total - a.total);

  // Per-market breakdown
  const piataMaps: Record<string, number> = {};
  for (const p of pariuri) {
    piataMaps[p.piata] = (piataMaps[p.piata] ?? 0) + 1;
  }
  const perPiata = Object.entries(piataMaps)
    .map(([piata, count]) => ({ piata, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);

  // Profit evolution — one entry per day with cumulative profit
  const dailyMap: Record<string, number> = {};
  for (const p of inchise) {
    const day = p.dataPariu.toISOString().slice(0, 10);
    dailyMap[day] = (dailyMap[day] ?? 0) + (p.castigSauPierdere ?? 0);
  }
  let cumulative = 0;
  const evolutie = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, profit]) => { cumulative += profit; return { data, profit, cumulative }; });

  return NextResponse.json({
    stats: {
      total,
      castigate,
      profitNet: parseFloat(profitNet.toFixed(2)),
      rataWin,
      roi,
      cotaMedie,
      streakMaxim: maxStreak,
    },
    perSport,
    perPiata,
    evolutie,
    period,
  });
}
