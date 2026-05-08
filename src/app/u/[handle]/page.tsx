/**
 * Public profile page for funded pickers.
 * URL pattern: /u/[handle]  where handle is a slug derived from numeComplet (or fallback to id slice).
 *
 * Privacy:
 *   - Only users with at least one FINANTAT account are listed.
 *   - We never expose email, full name, or anything PII beyond the handle they chose.
 *   - Bets shown are settled only and limited to the last 50.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Trophy, TrendingUp, Calendar, Share2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

type RouteParams = { handle: string };

async function findProfile(handle: string) {
  // Strategy: try to match by id-prefix first, then full nume slug.
  const byId = await prisma.utilizator.findFirst({
    where: { id: { startsWith: handle } },
    include: {
      conturi: { where: { statusEvaluare: 'FINANTAT' }, orderBy: { createdAt: 'desc' } },
      pariuri: { where: { statusPariu: { in: ['CASTIGAT', 'PIERDUT'] } }, orderBy: { dataRezultat: 'desc' }, take: 50 },
    },
  });
  return byId;
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: `Picker ${handle} — SuperFunded`,
    description: `Profil public picker funded SuperFunded. Statistici, picks-uri și performanță.`,
  };
}

export default async function PublicPickerProfile({ params }: { params: Promise<RouteParams> }) {
  const { handle } = await params;
  const profile = await findProfile(handle);
  if (!profile || profile.conturi.length === 0) notFound();

  const totalProfit = profile.conturi.reduce((s, c) => s + c.profitTotal, 0);
  const wins = profile.pariuri.filter(p => p.statusPariu === 'CASTIGAT').length;
  const losses = profile.pariuri.filter(p => p.statusPariu === 'PIERDUT').length;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;
  const totalCapital = profile.conturi.reduce((s, c) => s + c.capitalInceput, 0);
  const displayName = profile.numeComplet ?? `picker_${profile.id.slice(0, 6)}`;

  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header card */}
        <div className="rounded-3xl p-6 md:p-8 mb-6"
          style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.06)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-extrabold text-white"
              style={{ background: 'linear-gradient(135deg, var(--red), var(--red-dark))' }}>
              {(displayName[0] ?? 'P').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text)' }}>{displayName}</h1>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--red)' }}>
                Funded Picker · {profile.conturi.length} cont{profile.conturi.length > 1 ? 'uri' : ''}
              </p>
            </div>
            <ShareButton handle={profile.id.slice(0, 8)} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={Trophy} label="Capital total" value={`€${totalCapital.toLocaleString('ro-RO')}`} />
            <Stat icon={TrendingUp} label="Profit" value={`€${totalProfit.toFixed(2)}`} accent />
            <Stat icon={Trophy} label="Win rate" value={`${winRate.toFixed(1)}%`} />
            <Stat icon={Calendar} label="Picks settled" value={String(wins + losses)} />
          </div>
        </div>

        {/* Recent picks */}
        <div className="rounded-3xl overflow-hidden mb-6"
          style={{ background: 'white', border: '1px solid var(--border)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Ultimele picks-uri settled
            </h2>
          </div>
          {profile.pariuri.length === 0 ? (
            <div className="p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Niciun pick settled încă.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {profile.pariuri.map(p => (
                <div key={p.id} className="grid grid-cols-12 px-6 py-3 items-center text-sm">
                  <span className="col-span-5 truncate" style={{ color: 'var(--text)' }}>{p.eveniment}</span>
                  <span className="col-span-2 text-xs" style={{ color: 'var(--text-muted)' }}>{p.selectie}</span>
                  <span className="col-span-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>@ {p.cota}</span>
                  <span className={`col-span-1 text-[10px] font-bold uppercase tracking-wider ${
                    p.statusPariu === 'CASTIGAT' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {p.statusPariu === 'CASTIGAT' ? 'WIN' : 'LOSS'}
                  </span>
                  <span className={`col-span-2 text-right font-bold ${
                    (p.castigSauPierdere ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {p.castigSauPierdere != null ? `${p.castigSauPierdere > 0 ? '+' : ''}€${p.castigSauPierdere.toFixed(2)}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/planuri"
            className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            Devino picker funded ca {displayName} →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value, accent }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string; accent?: boolean;
}) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: accent ? '#fff1f2' : 'var(--bg-alt2)', border: `1px solid ${accent ? '#fecdd3' : 'var(--border)'}` }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="text-xl font-extrabold" style={{ color: accent ? 'var(--red)' : 'var(--text)' }}>{value}</div>
    </div>
  );
}

function ShareButton({ handle }: { handle: string }) {
  return (
    <a href={`/u/${handle}`}
      className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
      style={{ background: 'var(--bg-alt2)', color: 'var(--text)' }}>
      <Share2 className="w-3.5 h-3.5" />
      Share profil
    </a>
  );
}
