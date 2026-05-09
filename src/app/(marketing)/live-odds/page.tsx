import type { Metadata } from 'next';
import LiveOddsTabs from './tabs-client';

export const metadata: Metadata = {
  title: 'Cote live | SuperFunded',
  description: 'Cote actualizate în timp real la EPL, La Liga, UCL, NBA, ATP, UFC și mai multe — direct din feed-ul TheOddsAPI.',
};

export default function LiveOddsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl mx-auto">
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

        <LiveOddsTabs />
      </div>
    </main>
  );
}
