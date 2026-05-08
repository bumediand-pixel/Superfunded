'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const SIZES = [1000, 5000, 10000, 25000, 50000];

export default function HeroProfitCalc() {
  const [size, setSize] = useState(10000);
  const [winRate, setWinRate] = useState(58);

  const monthlyGross = useMemo(() => {
    // 60 picks/mo × 2% stake × decimal odds 1.95 (avg) × edge from win rate vs implied
    const stake = size * 0.02;
    const evPerPick = stake * (winRate / 100 * 0.95 - (1 - winRate / 100));
    return Math.max(0, evPerPick * 60);
  }, [size, winRate]);

  const monthlyNet = monthlyGross * 0.80; // 80% split
  const yearlyNet = monthlyNet * 12;

  return (
    <div className="rounded-3xl p-6 md:p-7 max-w-md mx-auto"
      style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(15,23,42,0.10)', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4"
        style={{ color: 'var(--red)' }}>
        <TrendingUp className="w-3.5 h-3.5" />
        Calculator profit lunar
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Mărime cont</div>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map(s => (
            <button key={s} onClick={() => setSize(s)}
              className="text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition-all"
              style={size === s
                ? { background: 'var(--text)', color: 'white' }
                : { background: 'var(--bg-alt2)', color: 'var(--text)' }}>
              €{s >= 1000 ? `${s / 1000}K` : s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Win rate</span>
          <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>{winRate}%</span>
        </div>
        <input type="range" min="50" max="70" step="1" value={winRate}
          onChange={e => setWinRate(parseInt(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: 'var(--red)' }} />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-subtle)' }}>
          <span>50% (break-even)</span><span>70% (elite)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl p-3" style={{ background: 'var(--bg-alt2)' }}>
          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
            Lunar (net)
          </div>
          <div className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
            €{Math.round(monthlyNet).toLocaleString('ro-RO')}
          </div>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
            Anual (net)
          </div>
          <div className="text-2xl font-extrabold" style={{ color: 'var(--red)' }}>
            €{Math.round(yearlyNet).toLocaleString('ro-RO')}
          </div>
        </div>
      </div>

      <Link href="/planuri"
        className="block text-center w-full font-bold text-sm py-3 rounded-xl cursor-pointer transition-all"
        style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
        Începe cu €{(size / 1000).toFixed(0)}K →
      </Link>

      <p className="text-[10px] text-center mt-3" style={{ color: 'var(--text-subtle)' }}>
        Estimare bazată pe 60 picks/lună · 2% stake · 80% split · cota medie 1.95
      </p>
    </div>
  );
}
