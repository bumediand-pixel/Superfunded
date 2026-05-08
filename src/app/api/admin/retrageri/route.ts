import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { sendRetragereStatusEmail } from '@/lib/email';

const Schema = z.object({
  id: z.string().min(1),
  status: z.enum(['PROCESAT', 'RESPINS']),
});

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  const { id, status } = parsed.data;

  const retragere = await prisma.retragere.findUnique({
    where: { id },
    include: { utilizator: { select: { email: true } } },
  });
  if (!retragere) return NextResponse.json({ error: 'Retragere negăsită' }, { status: 404 });

  // If approving, deduct from the user's funded account capital.
  if (status === 'PROCESAT') {
    await prisma.$transaction(async tx => {
      const fundedConturi = await tx.contTrader.findMany({
        where: { utilizatorId: retragere.utilizatorId, statusEvaluare: 'FINANTAT', activ: true },
        orderBy: { capitalCurent: 'desc' },
      });
      // Deduct from the largest funded account
      let remaining = retragere.suma;
      for (const c of fundedConturi) {
        if (remaining <= 0) break;
        const take = Math.min(remaining, c.capitalCurent);
        if (take > 0) {
          await tx.contTrader.update({
            where: { id: c.id },
            data: { capitalCurent: { decrement: take } },
          });
          remaining -= take;
        }
      }
      await tx.retragere.update({
        where: { id },
        data: { status: 'PROCESAT', procesatLa: new Date() },
      });
    });
  } else {
    await prisma.retragere.update({
      where: { id },
      data: { status: 'RESPINS', procesatLa: new Date() },
    });
  }

  if (retragere.utilizator?.email) {
    sendRetragereStatusEmail(retragere.utilizator.email, retragere.suma, status === 'PROCESAT' ? 'APROBAT' : 'RESPINS')
      .catch(err => console.error('[admin/retrageri] email failed:', err));
  }

  return NextResponse.json({ ok: true });
}
