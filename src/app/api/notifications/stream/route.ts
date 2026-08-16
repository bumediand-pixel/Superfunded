/**
 * Server-Sent Events stream for in-app notifications.
 *
 * Polls the user's recent state every 10s and emits diffs as `event: notification`
 * messages. Lightweight on serverless: each connection is a single long-lived response,
 * client EventSource reconnects automatically.
 *
 * Production-grade alternative: Supabase Realtime (postgres_changes) pushes events
 * directly when a row changes, no polling. Wire that in when you're confident on the
 * subscription model.
 */
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Notification = {
  id: string;
  kind: 'pick_settled' | 'phase_complete' | 'withdrawal_status' | 'kyc_update';
  title: string;
  body: string;
  ts: number;
};

const POLL_MS = 10_000;
const MAX_DURATION_MS = 5 * 60_000; // disconnect after 5 min so the platform recycles connections

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return new Response('User not found', { status: 404 });

  const userId = utilizator.id;
  const startedAt = Date.now();
  const lastPickIds = new Set<string>();
  const lastWithdrawalStatuses = new Map<string, string>();
  let lastKycStatus = utilizator.statusKYC;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, data: object) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('hello', { ts: Date.now() });

      const tick = async () => {
        if (req.signal.aborted) { controller.close(); return; }
        if (Date.now() - startedAt > MAX_DURATION_MS) {
          send('reconnect', { reason: 'timeout' });
          controller.close();
          return;
        }

        try {
          // Pick settles since last tick
          const recentSettles = await prisma.pariu.findMany({
            where: {
              utilizatorId: userId,
              statusPariu: { in: ['CASTIGAT', 'PIERDUT', 'JUMATATE_CASTIG'] },
              dataRezultat: { gte: new Date(Date.now() - 30_000) },
            },
            orderBy: { dataRezultat: 'desc' },
            take: 10,
          });
          for (const p of recentSettles) {
            if (lastPickIds.has(p.id)) continue;
            lastPickIds.add(p.id);
            const won = p.statusPariu === 'CASTIGAT';
            const notif: Notification = {
              id: `pick_${p.id}`,
              kind: 'pick_settled',
              title: won ? '✅ Pick câștigat' : '❌ Pick pierdut',
              body: `${p.eveniment} (${p.selectie}) · ${won ? '+' : ''}€${p.castigSauPierdere?.toFixed(2) ?? '0'}`,
              ts: p.dataRezultat?.getTime() ?? Date.now(),
            };
            send('notification', notif);
          }

          // Withdrawal status changes
          const wd = await prisma.retragere.findMany({
            where: { utilizatorId: userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
          });
          for (const w of wd) {
            const prev = lastWithdrawalStatuses.get(w.id);
            if (prev && prev !== w.status) {
              const approved = w.status === 'PROCESAT';
              const notif: Notification = {
                id: `wd_${w.id}_${w.status}`,
                kind: 'withdrawal_status',
                title: approved ? '💸 Retragere aprobată' : 'Retragere actualizată',
                body: `€${w.suma} via ${w.metodaPlata} · ${w.status}`,
                ts: Date.now(),
              };
              send('notification', notif);
            }
            lastWithdrawalStatuses.set(w.id, w.status);
          }

          // KYC change
          const fresh = await prisma.utilizator.findUnique({ where: { id: userId }, select: { statusKYC: true } });
          if (fresh && fresh.statusKYC !== lastKycStatus) {
            const notif: Notification = {
              id: `kyc_${fresh.statusKYC}_${Date.now()}`,
              kind: 'kyc_update',
              title: fresh.statusKYC === 'APROBAT' ? '✓ KYC aprobat' : 'KYC actualizat',
              body: `Status: ${fresh.statusKYC}`,
              ts: Date.now(),
            };
            send('notification', notif);
            lastKycStatus = fresh.statusKYC;
          }

          // Phase progression — quick check
          const conturi = await prisma.contTrader.findMany({
            where: { utilizatorId: userId },
            select: { id: true, statusEvaluare: true, fazaCurenta: true },
          });
          // (Future: track changes here too. Skipped to keep first iteration tight.)
        } catch (err) {
          console.error('[notifications/stream] poll error:', err);
        }

        setTimeout(tick, POLL_MS);
      };

      tick();
    },
    cancel() { /* client disconnected */ },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
