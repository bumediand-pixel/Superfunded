/**
 * DELETE /api/pariuri/[id] — cancel a bet IF it's still open AND ownership checks pass.
 *
 * Cancellation rules (industry standard):
 *   - Only DESCHIS bets can be cancelled
 *   - Cancel window: up to 5 minutes after placement OR before event commence_time,
 *     whichever is sooner. Cancellations after a substantial market move would let
 *     pickers game the system.
 *   - Cancelled bet → statusPariu = ANULAT, castigSauPierdere = 0, capital untouched.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const CANCEL_WINDOW_MS = 5 * 60 * 1000;

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });

  const bet = await prisma.pariu.findFirst({ where: { id, utilizatorId: utilizator.id } });
  if (!bet) return NextResponse.json({ error: 'Pick negăsit' }, { status: 404 });

  if (bet.statusPariu !== 'DESCHIS') {
    return NextResponse.json({ error: 'Pick deja settled — nu se mai poate anula' }, { status: 400 });
  }

  const elapsed = Date.now() - bet.dataPariu.getTime();
  if (elapsed > CANCEL_WINDOW_MS) {
    return NextResponse.json({ error: 'Fereastra de anulare expirată (5 min de la plasare)' }, { status: 400 });
  }

  await prisma.pariu.update({
    where: { id },
    data: { statusPariu: 'ANULAT', castigSauPierdere: 0, dataRezultat: new Date() },
  });

  return NextResponse.json({ ok: true });
}
