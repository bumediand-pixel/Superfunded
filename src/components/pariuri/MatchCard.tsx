'use client';
/**
 * Superbet-style match row.
 *
 * Each match shows up to three markets stacked vertically:
 *   1) 1X2 (h2h)            — 2 or 3 buttons
 *   2) Peste / Sub (totals) — Over/Under N.N
 *   3) Handicap (spreads)   — home ±N.N / away ±N.N
 *
 * Anything beyond the first three picks per event swaps the prior selection
 * (only one pick per match in the slip).
 */
import type { OddsEvent } from '@/lib/odds-api';
import { Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type Pick = {
  eventId: string;
  eveniment: string;
  sport: string;
  piata: string;
  selectie: string;
  cota: number;
};

type Props = {
  event: OddsEvent;
  selectedSelection?: string;
  onPick: (p: Pick) => void;
};

export default function MatchCard({ event, selectedSelection, onPick }: Props) {
  const bk = event.bookmakers?.[0];
  if (!bk) return null;

  const h2h     = bk.markets?.find(m => m.key === 'h2h');
  const totals  = bk.markets?.find(m => m.key === 'totals');
  const spreads = bk.markets?.find(m => m.key === 'spreads');

  const home = h2h?.outcomes.find(o => o.name === event.home_team);
  const away = h2h?.outcomes.find(o => o.name === event.away_team);
  const draw = h2h?.outcomes.find(o => o.name === 'Draw');

  const eveniment = `${event.home_team} vs ${event.away_team}`;
  const kickoff = new Date(event.commence_time);
  const today = new Date();
  const sameDay = kickoff.toDateString() === today.toDateString();
  const dateLabel = sameDay
    ? kickoff.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
    : kickoff.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const handle = (piata: string, selectie: string, cota?: number) => {
    if (!cota) return;
    onPick({ eventId: event.id, eveniment, sport: event.sport_key, piata, selectie, cota });
  };

  // Totals — pick the line closest to the headline (first outcome's point).
  const totalPoint = totals?.outcomes[0]?.point;
  const over  = totals?.outcomes.find(o => /^over$/i.test(o.name));
  const under = totals?.outcomes.find(o => /^under$/i.test(o.name));

  // Spreads — both lines have a `point`; show home line (away is mirror).
  const spreadHome = spreads?.outcomes.find(o => o.name === event.home_team);
  const spreadAway = spreads?.outcomes.find(o => o.name === event.away_team);

  return (
    <div className="rounded-xl p-3 sm:p-4 transition-colors hover:bg-white/[0.03]"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-6))' }}>

      {/* Header: teams + kickoff + details link */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="text-white font-semibold text-sm sm:text-[15px] truncate">{eveniment}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{dateLabel}</span>
            <span className="text-white/20">·</span>
            <span className="truncate">{event.sport_title}</span>
          </div>
        </div>
        <Link
          href={`/dashboard/pariuri/${event.id}?sport=${event.sport_key}`}
          aria-label="Vezi detalii meci"
          className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors"
          style={{ color: 'var(--dash-text-muted)', background: 'var(--dash-overlay-4)' }}>
          Detalii
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Market row 1: 1X2 */}
      {h2h && (
        <MarketRow label={draw ? '1 · X · 2' : 'Câștigător'}>
          <div className={`grid gap-2 ${draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <OddBtn label="1" sub={event.home_team} price={home?.price}
              active={selectedSelection === event.home_team}
              onClick={() => handle('1X2', event.home_team, home?.price)} />
            {draw && (
              <OddBtn label="X" sub="Egal" price={draw.price}
                active={selectedSelection === 'Draw'}
                onClick={() => handle('1X2', 'Draw', draw.price)} />
            )}
            <OddBtn label="2" sub={event.away_team} price={away?.price}
              active={selectedSelection === event.away_team}
              onClick={() => handle('1X2', event.away_team, away?.price)} />
          </div>
        </MarketRow>
      )}

      {/* Market row 2: Over/Under */}
      {totals && over && under && totalPoint != null && (
        <MarketRow label={`Total · ${totalPoint.toFixed(1)}`}>
          <div className="grid grid-cols-2 gap-2">
            <OddBtn label={`Peste ${totalPoint.toFixed(1)}`} price={over.price}
              active={selectedSelection === `Over ${totalPoint.toFixed(1)}`}
              onClick={() => handle('Total', `Over ${totalPoint.toFixed(1)}`, over.price)} />
            <OddBtn label={`Sub ${totalPoint.toFixed(1)}`} price={under.price}
              active={selectedSelection === `Under ${totalPoint.toFixed(1)}`}
              onClick={() => handle('Total', `Under ${totalPoint.toFixed(1)}`, under.price)} />
          </div>
        </MarketRow>
      )}

      {/* Market row 3: Handicap */}
      {spreads && spreadHome && spreadAway && spreadHome.point != null && (
        <MarketRow label="Handicap">
          <div className="grid grid-cols-2 gap-2">
            <OddBtn
              label={`${event.home_team.slice(0, 12)} ${spreadHome.point > 0 ? '+' : ''}${spreadHome.point}`}
              price={spreadHome.price}
              active={selectedSelection === `Home ${spreadHome.point > 0 ? '+' : ''}${spreadHome.point}`}
              onClick={() => handle('Handicap', `Home ${spreadHome.point! > 0 ? '+' : ''}${spreadHome.point}`, spreadHome.price)} />
            <OddBtn
              label={`${event.away_team.slice(0, 12)} ${spreadAway.point! > 0 ? '+' : ''}${spreadAway.point}`}
              price={spreadAway.price}
              active={selectedSelection === `Away ${spreadAway.point! > 0 ? '+' : ''}${spreadAway.point}`}
              onClick={() => handle('Handicap', `Away ${spreadAway.point! > 0 ? '+' : ''}${spreadAway.point}`, spreadAway.price)} />
          </div>
        </MarketRow>
      )}
    </div>
  );
}

function MarketRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 font-bold">{label}</div>
      {children}
    </div>
  );
}

function OddBtn({ label, sub, price, active, onClick }: {
  label: string; sub?: string; price?: number; active: boolean; onClick: () => void;
}) {
  const disabled = !price;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: active ? 'var(--red, #e63946)' : 'var(--dash-overlay-4)',
        color: '#fff',
        border: `1px solid ${active ? 'var(--red, #e63946)' : 'var(--dash-overlay-8)'}`,
        boxShadow: active ? '0 6px 16px rgba(230,57,70,0.32)' : 'none',
      }}>
      <div className="flex flex-col items-start min-w-0">
        <span className="text-[11px] font-semibold leading-tight truncate max-w-full text-left"
          style={{ color: active ? 'var(--dash-text-85)' : 'rgba(255,255,255,0.55)' }}>
          {label}
        </span>
        {sub && (
          <span className="text-[9px] uppercase tracking-wider leading-tight truncate max-w-full text-left"
            style={{ color: active ? 'var(--dash-text-70)' : 'var(--dash-text-40)' }}>
            {sub}
          </span>
        )}
      </div>
      <span className="font-extrabold text-base leading-tight flex-shrink-0">
        {price ? price.toFixed(2) : '—'}
      </span>
    </button>
  );
}
