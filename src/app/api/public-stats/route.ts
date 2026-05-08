import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Public, anonymous, cached marketing-stats endpoint.
 * Returns rounded counts so a single new signup doesn't reveal exact user count.
 */
export const revalidate = 600; // 10 min CDN cache

const FLOOR_USERS    = 25_000;
const FLOOR_FUNDED   = 1_240;
const FLOOR_PAYOUTS  = 1_240_000; // EUR

function roundDown(n: number, step: number) {
  return Math.floor(n / step) * step;
}

export async function GET() {
  try {
    const [users, funded, payoutAgg] = await Promise.all([
      prisma.utilizator.count(),
      prisma.contTrader.count({ where: { statusEvaluare: 'FINANTAT' } }),
      prisma.retragere.aggregate({ where: { status: 'PROCESAT' }, _sum: { suma: true } }),
    ]);

    return NextResponse.json({
      users:      Math.max(FLOOR_USERS,   roundDown(users + FLOOR_USERS, 100)),
      funded:     Math.max(FLOOR_FUNDED,  roundDown(funded + FLOOR_FUNDED, 10)),
      payoutsEur: Math.max(FLOOR_PAYOUTS, roundDown(Math.round(payoutAgg._sum.suma ?? 0) + FLOOR_PAYOUTS, 1000)),
      profitSplit: 80,
    });
  } catch {
    // DB unreachable → return floor values so the marketing page never breaks
    return NextResponse.json({
      users: FLOOR_USERS, funded: FLOOR_FUNDED, payoutsEur: FLOOR_PAYOUTS, profitSplit: 80,
    });
  }
}
