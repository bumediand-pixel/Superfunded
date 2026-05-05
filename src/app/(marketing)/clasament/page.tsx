'use client';
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

  const podium = data.length >= 3 ? [data[1], data[0], data[2]] : [];
  const podiumPos = [2, 1, 3];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--red)' }}>Live Rankings</div>
            <h1 className="font-bebas text-5xl md:text-6xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.06em' }}>CLASAMENT</h1>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {loading ? '…' : `${total} traderi activi`} · sortat după profit
            </p>
          </div>
          <div className="flex items-center gap-0 border self-start" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {(['7d', '30d', 'all'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-all duration-200"
                style={{
                  background: period === p ? 'var(--red)' : 'transparent',
                  color: period === p ? 'white' : 'rgba(255,255,255,0.4)',
                  borderRight: p !== 'all' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                {p === '7d' ? 'Ultimele 7 zile' : p === '30d' ? 'Ultimele 30 zile' : 'Tot timpul'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        {!loading && podium.length === 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {podium.map((entry, i) => {
              const pos = podiumPos[i];
              const isFirst = pos === 1;
              const medalColor = pos === 1 ? 'var(--gold)' : pos === 2 ? 'rgba(192,192,192,0.8)' : 'rgba(205,127,50,0.8)';
              return (
                <div key={entry.rank} className={`p-4 text-center ${isFirst ? 'md:-mt-4' : ''}`}
                  style={{
                    background: isFirst ? 'rgba(230,57,70,0.06)' : 'var(--black-2)',
                    border: `1px solid ${isFirst ? 'rgba(230,57,70,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <div className="font-bebas text-3xl mb-1" style={{ color: medalColor, letterSpacing: '0.04em' }}>#{pos}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-2 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{entry.username}</div>
                  <div className="font-bebas text-xl" style={{ color: entry.profitEur >= 0 ? '#22c55e' : 'var(--red)', letterSpacing: '0.04em' }}>
                    {entry.profitEur >= 0 ? '+' : ''}{entry.profitEur.toFixed(0)}€
                  </div>
                  <div className="font-mono text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>+{entry.profitPct}%</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <div style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-12 px-5 py-3 font-mono text-[9px] uppercase tracking-widest"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-4">Trader</div>
            <div className="col-span-2 text-right">Capital</div>
            <div className="col-span-2 text-right">Profit</div>
            <div className="col-span-2 text-right">ROI</div>
            <div className="col-span-1 text-right">Plan</div>
          </div>

          {loading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 px-5 py-4 gap-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              {[1, 4, 2, 2, 2, 1].map((span, j) => (
                <div key={j} className={`col-span-${span} h-4 rounded`}
                  style={{ background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${j * 60}ms` }} />
              ))}
            </div>
          ))}

          {!loading && data.length === 0 && (
            <div className="px-5 py-16 text-center font-mono text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Niciun trader activ în perioada selectată.
            </div>
          )}

          {!loading && data.map((entry) => (
            <div key={entry.rank} className="grid grid-cols-12 px-5 py-4 items-center transition-all duration-200"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="col-span-1 font-bebas text-lg" style={{ color: entry.rank <= 3 ? 'var(--gold)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
                {entry.rank}
              </div>
              <div className="col-span-4 font-mono text-xs truncate" style={{ color: 'var(--white-hi)' }}>{entry.username}</div>
              <div className="col-span-2 text-right font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                €{entry.capital.toLocaleString('ro-RO')}
              </div>
              <div className="col-span-2 text-right font-bebas text-base" style={{ color: entry.profitEur >= 0 ? '#22c55e' : 'var(--red)', letterSpacing: '0.04em' }}>
                {entry.profitEur >= 0 ? '+' : ''}{entry.profitEur.toFixed(0)}€
              </div>
              <div className="col-span-2 text-right font-mono text-xs" style={{ color: parseFloat(entry.profitPct) >= 0 ? 'rgba(34,197,94,0.7)' : 'rgba(230,57,70,0.7)' }}>
                {parseFloat(entry.profitPct) >= 0 ? '+' : ''}{entry.profitPct}%
              </div>
              <div className="col-span-1 text-right font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {PLAN_LABEL[entry.plan] ?? entry.plan}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Date live · Top 50 traderi · Pseudonime pentru confidențialitate
        </p>
      </div>
    </div>
  );
}
