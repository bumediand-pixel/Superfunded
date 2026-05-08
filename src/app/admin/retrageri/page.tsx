import { prisma } from '@/lib/prisma';
import RetrageriClient from './client';

export default async function AdminRetrageri() {
  let retrageri: Array<{
    id: string; suma: number; metodaPlata: string; status: string;
    createdAt: string; userEmail: string;
  }> = [];

  try {
    const rows = await prisma.retragere.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { utilizator: { select: { email: true } } },
    });
    retrageri = rows.map(r => ({
      id: r.id,
      suma: r.suma,
      metodaPlata: r.metodaPlata,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      userEmail: r.utilizator?.email ?? '—',
    }));
  } catch { /* DB unreachable */ }

  return <RetrageriClient initial={retrageri} />;
}
