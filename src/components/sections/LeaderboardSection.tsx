'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

const MEDAL = ['🥇', '🥈', '🥉'];

export default function LeaderboardSection() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clasament?period=30d&limit=5')
      .then(r => r.json())
      .then(d => setData(d.leaderboard ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="leaderboard" className="py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Competiție live
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Leaderboard
          </h2>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>Top pickeri · ultimele 30 de zile</p>
        </div>

        <div className="rounded-2xl overflow-hidden border" style={{ background: 'white', borderColor: 'var(--border)' }}>
          {/* Header */}
          <div className="grid grid-cols-12 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b"
            style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-5">Trader</div>
            <div className="col-span-2 text-right">Profit</div>
            <div className="col-span-2 text-right">ROI</div>
            <div className="col-span-2 text-right">Plan</div>
          </div>

          {loading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 px-5 py-4 gap-3 border-b animate-pulse"
              style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-1 h-4 rounded bg-slate-100" />
              <div className="col-span-5 h-4 rounded bg-slate-100" />
              <div className="col-span-2 h-4 rounded bg-slate-100 ml-auto" />
              <div className="col-span-2 h-4 rounded bg-slate-100 ml-auto" />
              <div className="col-span-2 h-4 rounded bg-slate-100 ml-auto" />
            </div>
          ))}

          {!loading && data.length === 0 && (
            <div className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Niciun trader activ momentan. Fii primul!
            </div>
          )}

          {!loading && data.map((entry) => (
            <div key={entry.rank} className="grid grid-cols-12 px-5 py-4 items-center border-b transition-colors hover:bg-slate-50 cursor-default"
              style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-1 text-base">
                {entry.rank <= 3 ? MEDAL[entry.rank - 1] : <span className="text-sm font-bold" style={{ color: 'var(--text-subtle)' }}>{entry.rank}</span>}
              </div>
              <div className="col-span-5 text-sm font-semibold" style={{ color: 'var(--text)' }}>{entry.username}</div>
              <div className="col-span-2 text-right text-sm font-extrabold"
                style={{ color: entry.profitEur >= 0 ? '#22c55e' : 'var(--red)' }}>
                {entry.profitEur >= 0 ? '+' : ''}{entry.profitEur.toFixed(0)}€
              </div>
              <div className="col-span-2 text-right text-xs font-semibold"
                style={{ color: parseFloat(entry.profitPct) >= 0 ? '#22c55e' : 'var(--red)' }}>
                {parseFloat(entry.profitPct) >= 0 ? '+' : ''}{entry.profitPct}%
              </div>
              <div className="col-span-2 text-right text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {PLAN_LABEL[entry.plan] ?? entry.plan}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/clasament"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-slate-50"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
            Vezi clasamentul complet →
          </Link>
        </div>
        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
          Date actualizate în timp real · Pseudonime pentru confidențialitate
        </p>
      </div>
    </section>
  );
}
