'use client';
import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

type Payout = { name: string; country: string; amount: number; minutesAgo: number; sport: string };

const DUMMY: Payout[] = [
  { name: 'Alex M.',  country: '🇷🇴', amount: 2840, minutesAgo: 12, sport: 'NBA' },
  { name: 'Marco S.', country: '🇮🇹', amount: 4120, minutesAgo: 27, sport: 'EPL' },
  { name: 'James L.', country: '🇬🇧', amount: 6200, minutesAgo: 41, sport: 'NFL' },
  { name: 'Cristian P.', country: '🇷🇴', amount: 1680, minutesAgo: 58, sport: 'UFC' },
  { name: 'Sofia R.', country: '🇪🇸', amount: 3450, minutesAgo: 74, sport: 'La Liga' },
  { name: 'Tom B.',   country: '🇩🇪', amount: 5910, minutesAgo: 92, sport: 'NBA' },
  { name: 'Andrei V.', country: '🇷🇴', amount: 2100, minutesAgo: 110, sport: 'ATP' },
  { name: 'Luca G.',  country: '🇮🇹', amount: 3870, minutesAgo: 138, sport: 'UCL' },
];

export default function PayoutTicker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      setVisible(true);
      setTimeout(() => {
        if (cancelled) return;
        setVisible(false);
        setTimeout(() => {
          if (cancelled) return;
          setIdx(i => (i + 1) % DUMMY.length);
          cycle();
        }, 600);
      }, 5400);
    };
    const initial = setTimeout(cycle, 3000);
    return () => { cancelled = true; clearTimeout(initial); };
  }, []);

  if (!visible) return null;
  const p = DUMMY[idx];

  return (
    <div className="fixed bottom-4 left-4 z-50 hidden md:block max-w-sm pointer-events-none"
      style={{ animation: 'sf-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 12px 32px rgba(15,23,42,0.12)' }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{ background: '#dcfce7' }}>
          <TrendingUp className="w-4 h-4" style={{ color: '#15803d' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Plată procesată {p.minutesAgo} min în urmă
          </div>
          <div className="text-sm font-extrabold truncate" style={{ color: 'var(--text)' }}>
            {p.country} {p.name} a primit <span style={{ color: '#15803d' }}>€{p.amount.toLocaleString('ro-RO')}</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{p.sport} picker · cont funded</div>
        </div>
      </div>
      <style jsx>{`
        @keyframes sf-slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
