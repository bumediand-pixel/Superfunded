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

  const { ensureUtilizator } = await import('@/lib/auth');
  const utilizator = await ensureUtilizator(user);

  const conturi = await prisma.contTrader.findMany({
    where: { utilizatorId: utilizator.id, activ: true },
    select: {
      id: true,
      plan: true,
      capitalInceput: true,
      capitalCurent: true,
      statusEvaluare: true,
      fazaCurenta: true,
      profitTotal: true,
      tranzactiiTotal: true,
      dataStart: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ conturi });
}
