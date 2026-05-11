'use client';
/**
 * /clasament — public leaderboard.
 * Rescris în paleta brand: fundal alb / cremoasă, text negru, accent roșu.
 * Fonturi sans-serif (heredate prin Tailwind) — fără mono/bebas „terminal".
 */
import { useEffect, useState } from 'react';

interface Entry {
  rank: number;
  username: string;
  capital: number;
  profitEur: number;
  profitPct: string;
  plan: string;
  status: string;
}

const PLAN_LABEL: Record<string, string> = {
  STARTER_500: '€500', BASIC_1000: '€1K', STANDARD_5000: '€5K',
  ADVANCED_10000: '€10K', PRO_25000: '€25K', ELITE_50000: '€50K',
};

const MEDAL: Record<number, { color: string; bg: string; border: string }> = {
  1: { color: '#b8860b', bg: '#fff7e6', border: '#f0c674' },
  2: { color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
  3: { color: '#9a4d1d', bg: '#fdf2e9', border: '#f5b78a' },
};

export default function ClasamentPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d');
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clasament?period=${period}&limit=50`)
      .then(r => r.json())
      .then(d => { setData(d.leaderboard ?? []); setTotal(d.total ?? 0); })
      .finally(() => setLoading(false));
  }, [period]);

  // Podium order: 2nd, 1st (taller), 3rd
  const podium = data.length >= 3 ? [data[1], data[0], data[2]] : [];
  const podiumPos = [2, 1, 3];

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase mb-3 px-3 py-1 rounded-full"
              style={{ background: '#fff1f2', color: 'var(--red, #e63946)', border: '1px solid #fecdd3' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--red, #e63946)' }} />
              Live
            </div>
            <h1 className="font-extrabold tracking-tight leading-none mb-3"
              style={{ fontSize: 'clamp(40px, 6vw, 64px)', color: 'var(--text, #0f172a)' }}>
              Clasament
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted, #64748b)' }}>
              {loading ? '...' : `${total} traderi activi`} · sortat după profit
            </p>
          </div>

          {/* Period filter — segmented control */}
          <div className="inline-flex p-1 rounded-full shadow-sm self-start"
            style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)' }}>
            {(['7d', '30d', 'all'] as const).map(p => {
              const on = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
                  style={on
                    ? { background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 4px 12px rgba(230,57,70,0.28)' }
                    : { background: 'transparent', color: 'var(--text-muted, #64748b)' }
                  }>
                  {p === '7d' ? '7 zile' : p === '30d' ? '30 zile' : 'Toate'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 3 podium */}
        {!loading && podium.length === 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 items-end">
            {podium.map((entry, i) => {
              const pos = podiumPos[i];
              const m = MEDAL[pos];
              const isFirst = pos === 1;
              return (
                <div key={entry.rank}
                  className={`rounded-2xl p-4 sm:p-6 text-center transition-all ${isFirst ? 'sm:-translate-y-3' : ''}`}
                  style={{
                    background: isFirst ? '#ffffff' : '#ffffff',
                    border: `2px solid ${m.border}`,
                    boxShadow: isFirst
                      ? '0 16px 40px rgba(230,57,70,0.12), 0 4px 12px rgba(15,23,42,0.06)'
                      : '0 4px 12px rgba(15,23,42,0.05)',
                  }}>
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-3 font-extrabold text-lg sm:text-xl"
                    style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                    {pos}
                  </div>
                  <div className="text-xs sm:text-sm font-bold truncate mb-2" style={{ color: 'var(--text, #0f172a)' }}>
                    {entry.username}
                  </div>
                  <div className="font-extrabold leading-none"
                    style={{
                      fontSize: isFirst ? 'clamp(22px, 3.5vw, 30px)' : 'clamp(18px, 2.8vw, 24px)',
                      color: entry.profitEur >= 0 ? '#16a34a' : 'var(--red, #e63946)',
                    }}>
                    {entry.profitEur >= 0 ? '+' : ''}€{entry.profitEur.toFixed(0)}
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted, #64748b)' }}>
                    {parseFloat(entry.profitPct) >= 0 ? '+' : ''}{entry.profitPct}% ROI
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' }}>

          {/* Header row */}
          <div className="grid grid-cols-12 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider"
            style={{ background: '#fafafa', borderBottom: '1px solid var(--border, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-4 sm:col-span-4">Trader</div>
            <div className="col-span-2 text-right hidden sm:block">Capital</div>
            <div className="col-span-3 sm:col-span-2 text-right">Profit</div>
            <div className="col-span-2 text-right">ROI</div>
            <div className="col-span-2 sm:col-span-1 text-right">Plan</div>
          </div>

          {loading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 px-4 sm:px-6 py-4 gap-2"
              style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}>
              {[1, 4, 2, 2, 2, 1].map((span, j) => (
                <div key={j} className={`col-span-${span} h-4 rounded animate-pulse`} style={{ background: '#f1f5f9' }} />
              ))}
            </div>
          ))}

          {!loading && data.length === 0 && (
            <div className="px-6 py-16 text-center text-sm" style={{ color: 'var(--text-muted, #64748b)' }}>
              Niciun trader activ în perioada selectată.
            </div>
          )}

          {!loading && data.map((entry) => {
            const positive = entry.profitEur >= 0;
            return (
              <div key={entry.rank}
                className="grid grid-cols-12 px-4 sm:px-6 py-3.5 items-center transition-colors"
                style={{ borderBottom: '1px solid var(--border, #e2e8f0)' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                <div className="col-span-1 font-extrabold text-sm sm:text-base"
                  style={{ color: entry.rank <= 3 ? 'var(--red, #e63946)' : 'var(--text-muted, #64748b)' }}>
                  {entry.rank}
                </div>
                <div className="col-span-4 sm:col-span-4 text-sm font-semibold truncate" style={{ color: 'var(--text, #0f172a)' }}>
                  {entry.username}
                </div>
                <div className="col-span-2 text-right text-xs hidden sm:block" style={{ color: 'var(--text-muted, #64748b)' }}>
                  €{entry.capital.toLocaleString('ro-RO')}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-extrabold text-sm"
                  style={{ color: positive ? '#16a34a' : 'var(--red, #e63946)' }}>
                  {positive ? '+' : ''}€{entry.profitEur.toFixed(0)}
                </div>
                <div className="col-span-2 text-right text-xs font-semibold"
                  style={{ color: parseFloat(entry.profitPct) >= 0 ? '#16a34a' : 'var(--red, #e63946)' }}>
                  {parseFloat(entry.profitPct) >= 0 ? '+' : ''}{entry.profitPct}%
                </div>
                <div className="col-span-2 sm:col-span-1 text-right text-xs font-semibold" style={{ color: 'var(--text-muted, #64748b)' }}>
                  {PLAN_LABEL[entry.plan] ?? entry.plan}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>
          Actualizat în timp real · Primii 50 traderi · Pseudonime pentru confidențialitate
        </p>
      </div>
    </main>
  );
}
