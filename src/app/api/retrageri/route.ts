import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimiter';

const WithdrawalSchema = z.object({
  suma: z.number().min(50).max(1_000_000),
  metoda: z.enum(['TRANSFER_BANCAR', 'CRYPTO']),
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

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ retrageri: [] });

  const retrageri = await prisma.retragere.findMany({
    where: { utilizatorId: utilizator.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ retrageri });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`retrageri:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 });
  }

  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const parsed = WithdrawalSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 });
  }
  const { suma, metoda } = parsed.data;

  const utilizator = await prisma.utilizator.findUnique({
    where: { supabaseId: user.id },
    include: { conturi: { where: { statusEvaluare: 'FINANTAT' } } },
  });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });
  if (utilizator.statusKYC !== 'APROBAT') return NextResponse.json({ error: 'KYC neaprobat' }, { status: 400 });
  if (!utilizator.conturi.length) return NextResponse.json({ error: 'Niciun cont finanțat activ' }, { status: 400 });

  // Verify sufficient balance across funded accounts
  const totalBalance = utilizator.conturi.reduce((acc, c) => acc + c.capitalCurent, 0);
  if (suma > totalBalance) return NextResponse.json({ error: 'Sold insuficient' }, { status: 400 });

  const retragere = await prisma.retragere.create({
    data: { utilizatorId: utilizator.id, suma, metodaPlata: metoda, detaliiPlata: {}, status: 'IN_PROCESARE' },
  });
  return NextResponse.json({ retragere });
}
