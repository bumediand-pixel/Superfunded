'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, Target, Zap, Award, Percent, BarChart3 } from 'lucide-react';

interface Stats {
  total: number;
  castigate: number;
  profitNet: number;
  rataWin: string | null;
  roi: string | null;
  cotaMedie: string | null;
  streakMaxim: number;
}
interface SportEntry { sport: string; total: number; castigate: number; pct: number; }
interface PiataEntry { piata: string; count: number; pct: number; }
interface EvoEntry { data: string; profit: number; cumulative: number; }

interface ApiResponse {
  stats: Stats | null;
  perSport: SportEntry[];
  perPiata: PiataEntry[];
  evolutie: EvoEntry[];
  period: string;
}

export default function StatisticiPage() {
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/statistici?period=${range}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  const s = data?.stats;
  const evo = data?.evolutie ?? [];
  const maxAbs = evo.length > 0 ? Math.max(...evo.map(e => Math.abs(e.profit)), 1) : 1;
  const topSports = (data?.perSport ?? []).slice(0, 6);
  const topPiete = (data?.perPiata ?? []).slice(0, 6);

  return (
    <div className="p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Statistici</h1>
          <p className="text-white/40 text-sm mt-1">Performanța ta pe pick-urile evaluate</p>
        </div>
        <div className="flex p-1 rounded-xl"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['7d', '30d', 'all'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-3 sm:px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all"
              style={range === r
                ? { background: 'var(--red, #e63946)', color: 'white' }
                : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }}>
              {r === '7d' ? '7 zile' : r === '30d' ? '30 zile' : 'Tot'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { icon: BarChart3, label: 'Total picks', val: s ? String(s.total) : '—',     sub: 'plasate' },
          { icon: Percent,   label: 'Win rate',  val: s?.rataWin ? `${s.rataWin}%` : '—', sub: 'câștiguri' },
          { icon: TrendingUp,label: 'Profit',    val: s ? `${s.profitNet >= 0 ? '+' : ''}€${s.profitNet.toFixed(0)}` : '—', sub: 'EUR net',
            color: s ? (s.profitNet >= 0 ? '#22c55e' : '#ef4444') : undefined, big: true },
          { icon: Target,    label: 'ROI',       val: s?.roi ? `${s.roi}%` : '—', sub: 'per pick' },
          { icon: Zap,       label: 'Cotă medie',val: s?.cotaMedie ?? '—', sub: 'odds avg' },
          { icon: Award,     label: 'Streak max',val: s ? String(s.streakMaxim) : '—', sub: 'wins în șir' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl p-3 sm:p-4"
              style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white/40">{k.label}</span>
                <Icon className="w-3.5 h-3.5 text-white/30" />
              </div>
              {loading ? (
                <div className="h-7 w-14 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
              ) : (
                <div className="text-base sm:text-xl font-extrabold leading-tight"
                  style={{ color: k.color ?? '#fff' }}>{k.val}</div>
              )}
              <div className="text-[10px] text-white/30 mt-1">{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Profit evolution */}
      <div className="rounded-2xl p-5 sm:p-6 mb-4"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-extrabold text-base text-white">Evoluție profit</h2>
          <span className="text-xs text-white/40 uppercase tracking-wider">EUR · {range === '7d' ? '7 zile' : range === '30d' ? '30 zile' : 'Tot'}</span>
        </div>
        <div className="flex items-end gap-px h-40 sm:h-48 pb-px"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {loading ? (
            Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: '20%', background: 'rgba(255,255,255,0.04)', minWidth: 3 }} />
            ))
          ) : evo.length === 0 ? (
            <div className="flex items-center justify-center w-full text-sm text-white/30">
              Niciun pick finalizat în perioada asta
            </div>
          ) : (
            evo.map((e, i) => {
              const h = Math.max(4, (Math.abs(e.profit) / maxAbs) * 100);
              return (
                <div key={i} title={`${e.data}: ${e.profit >= 0 ? '+' : ''}${e.profit.toFixed(2)}€`}
                  className="flex-1 transition-all duration-500 rounded-t cursor-default hover:opacity-80"
                  style={{ height: `${h}%`, background: e.profit >= 0 ? '#22c55e' : 'var(--red, #e63946)', minWidth: 3, opacity: 0.7 }} />
              );
            })
          )}
        </div>
        {evo.length > 0 && (
          <div className="flex justify-between mt-3 text-[10px] text-white/30">
            <span>{evo[0]?.data}</span>
            <span className="font-bold" style={{ color: (evo.at(-1)?.cumulative ?? 0) >= 0 ? '#22c55e' : '#ef4444' }}>
              Cumulat: {(evo.at(-1)?.cumulative ?? 0) >= 0 ? '+' : ''}€{(evo.at(-1)?.cumulative ?? 0).toFixed(2)}
            </span>
            <span>Azi</span>
          </div>
        )}
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Pe sport">
          {loading ? (
            <SkeletonRows />
          ) : topSports.length === 0 ? (
            <Empty text="Niciun pick înregistrat încă." />
          ) : (
            <div className="space-y-3">
              {topSports.map(({ sport, total: t, pct }) => (
                <div key={sport}>
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span className="text-white/60 capitalize">{sport.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-white">{t} <span className="text-white/40">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--red, #e63946)', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Distribuție piețe">
          {loading ? (
            <SkeletonRows />
          ) : topPiete.length === 0 ? (
            <Empty text="Niciun pick înregistrat încă." />
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {topPiete.map(({ piata, count, pct }) => (
                <div key={piata} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-white/70">{piata}</span>
                  <span className="text-white font-bold">{count} <span className="text-white/40 font-normal">· {pct}%</span></span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {!loading && !s && (
        <div className="mt-6 rounded-xl p-4 text-center text-xs text-white/40"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          Statisticile se populează automat pe măsură ce plasezi picks. Mergi la <span className="text-white/70 font-bold">Picks</span> ca să începi.
        </div>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 sm:p-6"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 className="font-extrabold text-base text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-sm text-white/30 py-4 text-center">{text}</div>;
}
