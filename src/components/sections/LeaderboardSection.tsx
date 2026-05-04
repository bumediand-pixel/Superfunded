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

export default function LeaderboardSection() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clasament?period=30d&limit=5')
      .then(r => r.json())
      .then(d => setData(d.leaderboard ?? []))
      .finally(() => setLoading(false));
  }, []);

  const skeletonRows = Array.from({ length: 5 });

  return (
    <section className="py-24" style={{ background: '#0f0f0f' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: 'var(--red)' }}>Competiție live</div>
          <h2 className="font-bebas text-5xl md:text-6xl tracking-widest text-white" style={{ letterSpacing: '0.06em' }}>LEADERBOARD</h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Top bettori — ultimele 30 de zile</p>
        </div>

        <div style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 font-mono text-[9px] uppercase tracking-widest"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-5">Trader</div>
            <div className="col-span-2 text-right">Profit</div>
            <div className="col-span-2 text-right">ROI</div>
            <div className="col-span-2 text-right">Plan</div>
          </div>

          {loading && skeletonRows.map((_, i) => (
            <div key={i} className="grid grid-cols-12 px-6 py-4 gap-3 items-center"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div className="col-span-1 h-5 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div className="col-span-5 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '100ms' }} />
              <div className="col-span-2 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '200ms' }} />
              <div className="col-span-2 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '300ms' }} />
              <div className="col-span-2 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '400ms' }} />
            </div>
          ))}

          {!loading && data.length === 0 && (
            <div className="px-6 py-12 text-center font-mono text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Niciun trader activ momentan. Fii primul!
            </div>
          )}

          {!loading && data.map((entry) => (
            <div key={entry.rank} className="grid grid-cols-12 px-6 py-4 items-center transition-all duration-200"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="col-span-1 font-bebas text-xl" style={{ color: entry.rank <= 3 ? 'var(--gold)' : 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
                {entry.rank}
              </div>
              <div className="col-span-5 font-mono text-xs" style={{ color: 'var(--white-hi)' }}>{entry.username}</div>
              <div className="col-span-2 text-right font-bebas text-lg" style={{ color: entry.profitEur >= 0 ? '#22c55e' : 'var(--red)', letterSpacing: '0.04em' }}>
                {entry.profitEur >= 0 ? '+' : ''}{entry.profitEur.toFixed(0)}€
              </div>
              <div className="col-span-2 text-right font-mono text-xs" style={{ color: parseFloat(entry.profitPct) >= 0 ? 'rgba(34,197,94,0.7)' : 'rgba(230,57,70,0.7)' }}>
                {parseFloat(entry.profitPct) >= 0 ? '+' : ''}{entry.profitPct}%
              </div>
              <div className="col-span-2 text-right font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {PLAN_LABEL[entry.plan] ?? entry.plan}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Date actualizate în timp real · Pseudonime pentru confidențialitate
        </p>
      </div>
    </section>
  );
}
