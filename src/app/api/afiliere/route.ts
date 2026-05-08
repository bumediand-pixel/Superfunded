import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimiter';
import { ensureUtilizator } from '@/lib/auth';

function generateCode(supabaseId: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed = supabaseId.replace(/-/g, '');
  let code = 'SF';
  for (let i = 0; i < 6; i++) {
    const idx = parseInt(seed.slice(i * 2, i * 2 + 2), 16) % chars.length;
    code += chars[idx];
  }
  return code;
}

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

// GET — fetch current user's affiliate info
export async function GET() {
  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  // Auto-mirror Supabase user into our Prisma table on first call.
  await ensureUtilizator(user);
  const utilizator = await prisma.utilizator.findUnique({
    where: { supabaseId: user.id },
    include: {
      afiliat: {
        include: {
          comisioane: { orderBy: { createdAt: 'desc' }, take: 20 },
        },
      },
    },
  });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });

  return NextResponse.json({ afiliat: utilizator.afiliat });
}

// POST — register as affiliate (idempotent)
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`afiliere:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 });
  }

  const user = await getSupabaseUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const utilizator = await ensureUtilizator(user);

  const existing = await prisma.afiliat.findUnique({ where: { utilizatorId: utilizator.id } });
  if (existing) return NextResponse.json({ afiliat: existing });

  const codReferral = generateCode(user.id);
  const afiliat = await prisma.afiliat.create({
    data: { utilizatorId: utilizator.id, codReferral },
  });

  return NextResponse.json({ afiliat }, { status: 201 });
}
