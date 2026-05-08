import LiveOddsWidget from '@/components/LiveOddsWidget';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cote live | SuperFunded',
  description: 'Cote actualizate în timp real la EPL, La Liga, UCL, NBA, ATP, UFC și mai multe — direct din feed-ul TheOddsAPI.',
};

const SPORTURI_LIVE = [
  { key: 'soccer_epl',                label: 'Premier League',      icon: '⚽' },
  { key: 'soccer_spain_la_liga',      label: 'La Liga',             icon: '⚽' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League',    icon: '⚽' },
  { key: 'basketball_nba',            label: 'NBA',                 icon: '🏀' },
  { key: 'tennis_atp_french_open',    label: 'Tenis ATP',           icon: '🎾' },
  { key: 'mma_mixed_martial_arts',    label: 'MMA / UFC',           icon: '🥊' },
];

export default function LiveOddsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--red)' }} />
            Live
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Cote în timp real
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Date actualizate automat la fiecare 60 de secunde, agregate din 8+ caziere europene.
          </p>
        </div>

        <div className="space-y-6">
          {SPORTURI_LIVE.map(sport => (
            <div key={sport.key} className="rounded-2xl p-6"
              style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
              <h2 className="text-xl font-extrabold mb-5 flex items-center gap-3" style={{ color: 'var(--text)' }}>
                <span aria-hidden>{sport.icon}</span>
                {sport.label}
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                  style={{ background: '#dcfce7', color: '#15803d' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#15803d' }} />
                  Live
                </span>
              </h2>
              <LiveOddsWidget sport={sport.key} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
