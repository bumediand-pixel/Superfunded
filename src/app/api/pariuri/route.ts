import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import Decimal from 'decimal.js';
import { rateLimit, rateLimitHeaders } from '@/lib/ratelimit';

const BetSchema = z.object({
  sport: z.string().min(1).max(50),
  eveniment: z.string().min(1).max(200),
  piata: z.string().min(1).max(100),
  selectie: z.string().min(1).max(100),
  cota: z.number().positive().max(1000),
  suma: z.number().positive().max(1_000_000),
  tipPariu: z.enum(['SIMPLU', 'COMBINAT', 'SISTEM', 'LIVE']).optional(),
  contId: z.string().min(1),
});

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

export async function GET() {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const { ensureUtilizator } = await import('@/lib/auth');
  const utilizator = await ensureUtilizator(user);

  const pariuri = await prisma.pariu.findMany({
    where: { utilizatorId: utilizator.id },
    orderBy: { dataPariu: 'desc' },
    take: 50,
  });
  return NextResponse.json({ pariuri });
}

export async function POST(req: NextRequest) {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  // Per-user rate limit (30 bets / minute). User-id keying prevents lockout
  // on shared IPs and stops a single account from spamming via IP rotation.
  const rl = await rateLimit('bets', `user:${user.id}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Prea multe cereri' },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  const parsed = BetSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Date invalide' },
      { status: 400, headers: rateLimitHeaders(rl) }
    );
  }
  const { cota, suma, ...rest } = parsed.data;

  const { ensureUtilizator } = await import('@/lib/auth');
  const utilizator = await ensureUtilizator(user);

  // Verify the contTrader belongs to this user
  const cont = await prisma.contTrader.findFirst({
    where: { id: rest.contId, utilizatorId: utilizator.id },
  });
  if (!cont) return NextResponse.json({ error: 'Cont invalid' }, { status: 403 });

  const potentialCastig = new Decimal(suma).times(new Decimal(cota)).toDecimalPlaces(2).toNumber();

  const pariu = await prisma.pariu.create({
    data: { ...rest, cota, suma, utilizatorId: utilizator.id, potentialCastig },
  });
  return NextResponse.json(pariu);
}
