'use client';
import { useEffect, useState } from 'react';

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

  const kpis = [
    { label: 'Total Pariuri', val: s ? String(s.total) : '—', sub: 'plasate' },
    { label: 'Rata Câștig', val: s?.rataWin ? `${s.rataWin}%` : '—', sub: '% win rate' },
    { label: 'Profit Net', val: s ? `${s.profitNet >= 0 ? '+' : ''}${s.profitNet.toFixed(2)}€` : '—', sub: 'EUR total', color: s && s.profitNet >= 0 ? '#22c55e' : 'var(--red)', gold: true },
    { label: 'ROI Mediu', val: s?.roi ? `${s.roi}%` : '—', sub: '% per pariu' },
    { label: 'Cotă Medie', val: s?.cotaMedie ?? '—', sub: 'odds medii' },
    { label: 'Streak Maxim', val: s ? String(s.streakMaxim) : '—', sub: 'win streak' },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen" style={{ background: 'var(--black-0)' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--red)' }}>Dashboard</div>
          <h1 className="font-bebas text-4xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>STATISTICILE MELE</h1>
        </div>
        <div className="flex items-center gap-0 border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {(['7d', '30d', 'all'] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className="font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-all duration-200"
              style={{
                background: range === r ? 'var(--red)' : 'transparent',
                color: range === r ? 'white' : 'rgba(255,255,255,0.4)',
                borderRight: r !== 'all' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
              {r === '7d' ? 'Ult. 7 zile' : r === '30d' ? 'Ult. 30 zile' : 'Tot timpul'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {kpis.map((k) => (
          <div key={k.label} className="px-5 py-4" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>{k.label}</div>
            {loading ? (
              <div className="h-7 w-16 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ) : (
              <div className="font-bebas text-2xl" style={{ color: k.color ?? 'var(--white-hi)', letterSpacing: '0.04em' }}>{k.val}</div>
            )}
            <div className="font-mono text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Profit evolution chart */}
      <div className="mb-8 p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="font-bebas text-xl tracking-wider" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>EVOLUȚIE PROFIT</div>
          <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>EUR · {range}</div>
        </div>
        <div className="flex items-end justify-center gap-px h-48" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {loading ? (
            Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1" style={{ height: '8%', background: 'rgba(255,255,255,0.06)', minWidth: 4 }} />
            ))
          ) : evo.length === 0 ? (
            <div className="flex items-center justify-center w-full font-mono text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Niciun pariu finalizat în această perioadă
            </div>
          ) : (
            evo.map((e, i) => {
              const h = Math.max(4, (Math.abs(e.profit) / maxAbs) * 100);
              return (
                <div key={i} title={`${e.data}: ${e.profit >= 0 ? '+' : ''}${e.profit.toFixed(2)}€`}
                  className="flex-1 transition-all duration-500 cursor-default"
                  style={{ height: `${h}%`, background: e.profit >= 0 ? 'rgba(34,197,94,0.5)' : 'rgba(230,57,70,0.5)', minWidth: 4 }} />
              );
            })
          )}
        </div>
        {evo.length > 0 && (
          <div className="flex justify-between mt-2 font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
            <span>{evo[0]?.data}</span>
            <span>Cumulat: {(evo[evo.length - 1]?.cumulative ?? 0) >= 0 ? '+' : ''}{(evo[evo.length - 1]?.cumulative ?? 0).toFixed(2)}€</span>
            <span>Azi</span>
          </div>
        )}
      </div>

      {/* Per sport + per market */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="font-bebas text-xl tracking-wider mb-5" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>PE SPORT</div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 rounded" style={{ background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : topSports.length === 0 ? (
            <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>Niciun pariu înregistrat.</p>
          ) : (
            <div className="space-y-3">
              {topSports.map(({ sport, total: t, pct }) => (
                <div key={sport}>
                  <div className="flex justify-between mb-1 font-mono text-[10px] uppercase tracking-widest">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{sport}</span>
                    <span style={{ color: 'var(--white-hi)' }}>{t} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--red)', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="font-bebas text-xl tracking-wider mb-5" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>DISTRIBUȚIE PIEȚE</div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded" style={{ background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : topPiete.length === 0 ? (
            <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>Niciun pariu înregistrat.</p>
          ) : (
            <div className="space-y-3">
              {topPiete.map(({ piata, count, pct }) => (
                <div key={piata} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-xs" style={{ color: 'var(--white-mid)' }}>{piata}</span>
                  <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{count} · {pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!loading && !s && (
        <div className="mt-8 px-5 py-4 font-mono text-xs text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
          Statisticile se populează automat pe măsură ce plasezi pariuri pe contul tău de evaluare.
        </div>
      )}
    </div>
  );
}
