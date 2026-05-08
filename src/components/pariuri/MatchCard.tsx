'use client';
/**
 * Single match row in Superbet style: home vs away on the left, three odds buttons (1 / X / 2) on the right.
 * Clicking an odds button fires `onPick` so the BetSlip can absorb the selection.
 *
 * The h2h market on The Odds API returns 2 outcomes (tennis/MMA) or 3 (football w/ Draw),
 * so we render either a 1/2 or 1/X/2 layout based on what the bookmaker returned.
 */
import type { OddsEvent } from '@/lib/odds-api';
import { Clock } from 'lucide-react';

export type Pick = {
  eventId: string;
  eveniment: string;          // "Real Madrid vs Barcelona"
  sport: string;              // sport_key
  piata: string;              // "1X2" | "Over/Under" etc
  selectie: string;           // "Real Madrid" | "Draw" | "Barcelona"
  cota: number;
};

type Props = {
  event: OddsEvent;
  selectedSelection?: string; // for highlighting active pick
  onPick: (p: Pick) => void;
};

export default function MatchCard({ event, selectedSelection, onPick }: Props) {
  // Pull the first bookmaker's h2h market — Superbet-style we show the best/headline market.
  const bk = event.bookmakers?.[0];
  const h2h = bk?.markets?.find(m => m.key === 'h2h');
  if (!h2h) return null;

  const home = h2h.outcomes.find(o => o.name === event.home_team);
  const away = h2h.outcomes.find(o => o.name === event.away_team);
  const draw = h2h.outcomes.find(o => o.name === 'Draw');

  const eveniment = `${event.home_team} vs ${event.away_team}`;
  const kickoff = new Date(event.commence_time);
  const today = new Date();
  const sameDay = kickoff.toDateString() === today.toDateString();
  const dateLabel = sameDay
    ? kickoff.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
    : kickoff.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const handle = (selectie: string, cota?: number) => {
    if (!cota) return;
    onPick({ eventId: event.id, eveniment, sport: event.sport_key, piata: '1X2', selectie, cota });
  };

  const btnStyle = (active: boolean) => ({
    background: active ? 'var(--red, #e63946)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fff' : '#fff',
    border: `1px solid ${active ? 'var(--red, #e63946)' : 'rgba(255,255,255,0.08)'}`,
    boxShadow: active ? '0 6px 16px rgba(230,57,70,0.32)' : 'none',
  });

  return (
    <div className="rounded-xl p-3 sm:p-4 transition-colors hover:bg-white/[0.03]"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm sm:text-[15px] truncate">{eveniment}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{dateLabel}</span>
            <span className="text-white/20">·</span>
            <span className="truncate">{event.sport_title}</span>
          </div>
        </div>
      </div>

      <div className={`grid gap-2 ${draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <OddBtn
          label="1"
          subLabel={event.home_team}
          price={home?.price}
          active={selectedSelection === event.home_team}
          onClick={() => handle(event.home_team, home?.price)}
        />
        {draw && (
          <OddBtn
            label="X"
            subLabel="Egal"
            price={draw.price}
            active={selectedSelection === 'Draw'}
            onClick={() => handle('Draw', draw.price)}
          />
        )}
        <OddBtn
          label="2"
          subLabel={event.away_team}
          price={away?.price}
          active={selectedSelection === event.away_team}
          onClick={() => handle(event.away_team, away?.price)}
        />
      </div>
    </div>
  );

  function OddBtn({ label, subLabel, price, active, onClick }: {
    label: string; subLabel: string; price?: number; active: boolean; onClick: () => void;
  }) {
    const disabled = !price;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="flex flex-col items-center justify-center rounded-lg py-2.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={btnStyle(active)}>
        <span className="text-[10px] uppercase tracking-wider text-white/50 truncate max-w-full px-1">
          {label} · {subLabel}
        </span>
        <span className="font-extrabold text-base sm:text-lg leading-tight mt-0.5">
          {price ? price.toFixed(2) : '—'}
        </span>
      </button>
    );
  }
}
