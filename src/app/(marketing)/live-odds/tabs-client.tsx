'use client';
/**
 * Marketing live-odds page — horizontal-scroll sport tabs (Superbet style)
 * sitting above a single LiveOddsWidget that mirrors the dashboard pattern.
 * Light theme variant: white surface + black text, red accent for the active tab.
 */
import { useState } from 'react';
import LiveOddsWidget from '@/components/LiveOddsWidget';

const SPORTURI_LIVE = [
  { key: 'soccer_epl',                label: 'Premier League',      icon: '⚽' },
  { key: 'soccer_spain_la_liga',      label: 'La Liga',             icon: '⚽' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League',    icon: '⚽' },
  { key: 'basketball_nba',            label: 'NBA',                 icon: '🏀' },
  { key: 'tennis_atp_french_open',    label: 'Tenis ATP',           icon: '🎾' },
  { key: 'mma_mixed_martial_arts',    label: 'MMA / UFC',           icon: '🥊' },
];

export default function LiveOddsTabs() {
  const [active, setActive] = useState(SPORTURI_LIVE[0].key);
  const current = SPORTURI_LIVE.find(s => s.key === active) ?? SPORTURI_LIVE[0];

  return (
    <div className="space-y-5">
      {/* Horizontally scrollable tab row — never wraps */}
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto sticky top-16 z-20"
        style={{ background: 'var(--bg-alt)' }}>
        <div className="flex gap-2 py-3 min-w-max">
          {SPORTURI_LIVE.map(s => {
            const on = s.key === active;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                className="inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer"
                style={on
                  ? { background: 'var(--red)', color: '#fff', boxShadow: '0 6px 18px rgba(230,57,70,0.32)' }
                  : { background: '#fff', color: 'var(--text)', border: '1px solid var(--border)' }
                }>
                <span aria-hidden>{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget for the selected sport */}
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
        <h2 className="text-xl font-extrabold mb-5 flex items-center gap-3" style={{ color: 'var(--text)' }}>
          <span aria-hidden>{current.icon}</span>
          {current.label}
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
            style={{ background: '#dcfce7', color: '#15803d' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#15803d' }} />
            Live
          </span>
        </h2>
        <LiveOddsWidget key={current.key} sport={current.key} />
      </div>
    </div>
  );
}
