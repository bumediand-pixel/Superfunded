import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const PeriodSchema = z.enum(['7d', '30d', 'all']).catch('30d');
const LimitSchema = z.number().int().positive().max(100).catch(20);

export async function GET(req: NextRequest) {
  const period = PeriodSchema.parse(req.nextUrl.searchParams.get('period'));
  const limitRaw = parseInt(req.nextUrl.searchParams.get('limit') ?? '20');
  const limit = LimitSchema.parse(isNaN(limitRaw) ? 20 : limitRaw);

  try {
    const dateFilter = period === '7d'
      ? new Date(Date.now() - 7 * 86400000)
      : period === '30d'
      ? new Date(Date.now() - 30 * 86400000)
      : new Date(0);

    const conturi = await prisma.contTrader.findMany({
      where: {
        statusEvaluare: { in: ['FINANTAT', 'FAZA_1', 'FAZA_2'] },
        createdAt: { gte: dateFilter },
      },
      include: {
        utilizator: { select: { numeComplet: true, email: true } },
      },
      orderBy: { profitTotal: 'desc' },
      take: limit,
    });

    const leaderboard = conturi.map((cont, i) => {
      // Use explicit display name only — never expose email or partial email on a public endpoint
      const displayName = cont.utilizator?.numeComplet ?? `trader_${cont.id.slice(0, 8)}`;

      return {
        rank: i + 1,
        username: displayName,
        capital: cont.capitalInceput,
        profitEur: cont.profitTotal,
        profitPct: cont.capitalInceput > 0
          ? ((cont.profitTotal / cont.capitalInceput) * 100).toFixed(1)
          : '0.0',
        plan: cont.plan,
        status: cont.statusEvaluare,
      };
    });

    return NextResponse.json({ leaderboard, period, total: conturi.length });
  } catch {
    return NextResponse.json({ leaderboard: [], period, total: 0 });
  }
}
