'use client';
import { useEffect, useState } from 'react';

interface Odds {
  id: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: { markets: { outcomes: { name: string; price: number }[] }[] }[];
}

export default function LiveOddsWidget({ sport = 'soccer_epl' }: { sport?: string }) {
  const [odds, setOdds] = useState<Odds[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const res = await fetch(`/api/odds/live?sport=${sport}`);
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setOdds(data.slice(0, 6));
      } catch {
        setError('Eroare la încărcare');
      } finally {
        setLoading(false);
      }
    };
    fetchOdds();
    const interval = setInterval(fetchOdds, 30000);
    return () => clearInterval(interval);
  }, [sport]);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
      {error} — Configurează ODDS_API_KEY în .env.local
    </div>
  );

  return (
    <div className="space-y-3">
      {odds.map((event) => {
        const outcomes = event.bookmakers?.[0]?.markets?.[0]?.outcomes ?? [];
        const home = outcomes.find(o => o.name === event.home_team);
        const away = outcomes.find(o => o.name === event.away_team);
        const draw = outcomes.find(o => o.name === 'Draw');
        return (
          <div key={event.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs">{event.sport_title}</span>
              <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-white text-sm font-semibold truncate flex-1">{event.home_team}</span>
              <div className="flex gap-2 shrink-0">
                {home && <span className="bg-white/10 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">{home.price.toFixed(2)}</span>}
                {draw && <span className="bg-white/10 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">{draw.price.toFixed(2)}</span>}
                {away && <span className="bg-white/10 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors">{away.price.toFixed(2)}</span>}
              </div>
              <span className="text-white text-sm font-semibold truncate flex-1 text-right">{event.away_team}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
