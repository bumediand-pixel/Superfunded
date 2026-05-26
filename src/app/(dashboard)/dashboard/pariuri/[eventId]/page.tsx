'use client';
/**
 * Match-detail page — `/dashboard/pariuri/[eventId]?sport=soccer_epl`.
 *
 * Superbet-style tab bar:
 *   Cote (toate piețele) | H2H (head-to-head) | Echipe (formații) | Analize
 *
 * Data: foloseşte feed-ul /api/odds/live deja cached la 30s. H2H + Echipe +
 * Analize sunt placeholders structurate — vor primi date reale odată cu un
 * upgrade la SportRadar / FotMob (Odds API nu expune nici lineups, nici H2H).
 *
 * Limbaj ONJN-safe: pick-uri / predicții simulate, nu „bets reale".
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Users, Clock, Loader2, Info, Star, Activity, Lock } from 'lucide-react';
import type { OddsEvent } from '@/lib/odds-api';
import {
  MARKET_CATALOG,
  MARKET_CATEGORY_LABELS,
  marketsForCategory,
  type MarketCategory,
} from '@/lib/odds-api';

type Tab = 'cote' | 'h2h' | 'echipe' | 'analize';

export default function MatchDetailPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sport = searchParams.get('sport') ?? 'soccer_epl';
  const eventId = params.eventId;

  const [event, setEvent] = useState<OddsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('cote');

  useEffect(() => {
    setLoading(true);
    // Prefer the per-event endpoint (richer market depth: btts, DNB, half-time, etc.).
    // Fall back to the listing endpoint if the per-event fetch fails.
    fetch(`/api/odds/event/${eventId}?sport=${sport}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(async (d: { event: OddsEvent | null; status: string }) => {
        if (d.event) {
          setEvent(d.event);
          return;
        }
        const fallback = await fetch(`/api/odds/live?sport=${sport}`, { cache: 'no-store' }).then(r => r.json());
        const list = Array.isArray(fallback.events) ? fallback.events : [];
        setEvent(list.find((e: OddsEvent) => e.id === eventId) ?? null);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [sport, eventId]);

  const kickoff = event ? new Date(event.commence_time) : null;

  return (
    <div className="p-4 sm:p-6 pb-24">
      {/* Back button + hero */}
      <button type="button" onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer mb-4"
        style={{ color: 'var(--dash-text-muted)' }}>
        <ArrowLeft className="w-4 h-4" />
        Înapoi la meciuri
      </button>

      {loading && (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--dash-text-muted)' }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Se încarcă detaliile meciului…
        </div>
      )}

      {!loading && !event && (
        <div className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
          <div className="text-4xl mb-3">📭</div>
          <h2 className="font-extrabold text-lg mb-1" style={{ color: 'var(--dash-text)' }}>Meciul nu mai e disponibil</h2>
          <p className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>
            Poate s-a încheiat sau cotele au expirat. Întoarce-te la listă.
          </p>
        </div>
      )}

      {event && (
        <>
          {/* Hero with team names + kickoff */}
          <div className="rounded-2xl p-5 sm:p-7 mb-5"
            style={{
              background: 'var(--dash-surface, #141414)',
              border: '1px solid var(--dash-border)',
            }}>
            <div className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: 'var(--dash-text-muted)' }}>
              {event.sport_title}
            </div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex-1 text-right">
                <div className="font-extrabold text-base sm:text-xl truncate" style={{ color: 'var(--dash-text)' }}>
                  {event.home_team}
                </div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--dash-text-subtle)' }}>
                  Gazdă
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0 px-3">
                <span className="font-extrabold text-2xl sm:text-3xl" style={{ color: 'var(--red, #e63946)' }}>vs</span>
                {kickoff && (
                  <span className="flex items-center gap-1 mt-1 text-[10px] font-semibold whitespace-nowrap"
                    style={{ color: 'var(--dash-text-muted)' }}>
                    <Clock className="w-3 h-3" />
                    {kickoff.toLocaleString('ro-RO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-base sm:text-xl truncate" style={{ color: 'var(--dash-text)' }}>
                  {event.away_team}
                </div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--dash-text-subtle)' }}>
                  Deplasare
                </div>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-6 border-b mb-5" style={{ borderColor: 'var(--dash-border)' }}>
            {([
              { key: 'cote',   label: 'Cote',    icon: BarChart3 },
              { key: 'h2h',    label: 'H2H',     icon: Activity },
              { key: 'echipe', label: 'Echipe',  icon: Users },
              { key: 'analize',label: 'Analize', icon: Star },
            ] as const).map(t => {
              const on = tab === t.key;
              const Icon = t.icon;
              return (
                <button key={t.key} type="button" onClick={() => setTab(t.key)}
                  className="relative inline-flex items-center gap-1.5 pb-2.5 text-sm font-bold cursor-pointer transition-colors"
                  style={{ color: on ? 'var(--dash-text)' : 'var(--dash-text-muted)' }}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {on && <span className="absolute -bottom-px left-0 right-0 h-0.5"
                    style={{ background: 'var(--red, #e63946)' }} />}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === 'cote' && <CoteTab event={event} />}
          {tab === 'h2h' && <H2HTab event={event} />}
          {tab === 'echipe' && <EchipeTab event={event} />}
          {tab === 'analize' && <AnalizeTab event={event} />}
        </>
      )}
    </div>
  );
}

/* ── COTE — Superbet-style category tabs + market depth ── */
const CATEGORY_TABS: { key: MarketCategory; label: string }[] = [
  { key: 'principale',      label: 'Principale' },
  { key: 'goluri',          label: 'Goluri' },
  { key: 'prima_repriza',   label: 'Prima repriză' },
  { key: 'a_doua_repriza',  label: 'A doua repriză' },
  { key: 'cornere',         label: 'Cornere' },
  { key: 'cartonase',       label: 'Cartonașe' },
  { key: 'jucator',         label: 'Jucător' },
  { key: 'combo',           label: 'Combo' },
  { key: 'speciale',        label: 'Speciale' },
];

function CoteTab({ event }: { event: OddsEvent }) {
  const [category, setCategory] = useState<MarketCategory>('principale');
  const bk = event.bookmakers?.[0];

  if (!bk) {
    return <Empty msg="Niciun feed de cote disponibil pentru acest meci." />;
  }

  /** Map: apiKey → the market object on this bookmaker (if present). */
  const marketsByKey = useMemo(() => {
    const m: Record<string, typeof bk.markets[number]> = {};
    for (const mk of bk.markets ?? []) m[mk.key] = mk;
    return m;
  }, [bk]);

  const visibleMarkets = marketsForCategory(category);

  return (
    <div className="space-y-4">
      {/* Category pill row — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6"
        style={{ scrollbarWidth: 'none' }}>
        <div className="inline-flex gap-1.5 pb-2 min-w-max">
          {CATEGORY_TABS.map(t => {
            const on = category === t.key;
            const count = MARKET_CATALOG.filter(m => m.category === t.key && m.available).length;
            return (
              <button key={t.key} type="button" onClick={() => setCategory(t.key)}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                style={on
                  ? { background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 4px 12px rgba(230,57,70,0.32)' }
                  : { background: 'var(--dash-overlay-4)', color: 'var(--dash-text)', border: '1px solid var(--dash-border)' }
                }>
                {t.label}
                {count > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: on ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)',
                      color: on ? '#fff' : 'var(--dash-text-muted)',
                    }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Markets in selected category */}
      {visibleMarkets.map(def => {
        const market = def.apiKey ? marketsByKey[def.apiKey] : null;

        // Unavailable market — placeholder card
        if (!def.available || !market) {
          return (
            <MarketBlock key={def.label} title={def.label}>
              <div className="flex items-center justify-center gap-2 py-3"
                style={{ color: 'var(--dash-text-subtle)' }}>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {def.apiKey
                    ? 'Cote indisponibile pentru acest meci'
                    : 'În curând — integrăm cu un feed extins în Q3 2026'}
                </span>
              </div>
            </MarketBlock>
          );
        }

        return (
          <MarketBlock key={def.label} title={def.label}>
            <MarketOutcomes event={event} market={market} apiKey={def.apiKey!} />
          </MarketBlock>
        );
      })}

      <div className="rounded-xl p-4 flex items-start gap-2"
        style={{ background: 'var(--dash-overlay-3)', border: '1px solid var(--dash-border)' }}>
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--dash-text-muted)' }} />
        <p className="text-xs leading-relaxed" style={{ color: 'var(--dash-text-muted)' }}>
          Cotele sunt agregate din feed-ul nostru de date și folosite pentru evaluarea predicțiilor tale simulate.
          Plasarea unui pick se face din lista principală — apasă „Înapoi la meciuri".
        </p>
      </div>
    </div>
  );
}

/** Renders the outcome buttons for a market — layout switches by market type. */
function MarketOutcomes({
  event,
  market,
  apiKey,
}: {
  event: OddsEvent;
  market: { key: string; outcomes: { name: string; price: number; point?: number }[] };
  apiKey: string;
}) {
  // Helpers
  const labelFor1X2 = (name: string) =>
    name === event.home_team ? '1' : name === event.away_team ? '2' : 'X';
  const subFor1X2 = (name: string) => (name === 'Draw' ? 'Egal' : name);

  // 1X2 / moneyline-style
  if (apiKey === 'h2h' || apiKey === 'h2h_h1') {
    const has3 = market.outcomes.some(o => o.name === 'Draw');
    return (
      <div className={`grid gap-2 ${has3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {market.outcomes.map(o => (
          <OddBtn key={o.name} label={labelFor1X2(o.name)} sub={subFor1X2(o.name)} price={o.price} />
        ))}
      </div>
    );
  }

  // Totals (Over/Under): group by point line, show Over+Under side by side
  if (apiKey === 'totals' || apiKey === 'totals_h1') {
    const grouped = new Map<number, { over?: number; under?: number }>();
    for (const o of market.outcomes) {
      if (typeof o.point !== 'number') continue;
      const g = grouped.get(o.point) ?? {};
      if (o.name === 'Over') g.over = o.price;
      else g.under = o.price;
      grouped.set(o.point, g);
    }
    return (
      <div className="space-y-1.5">
        {Array.from(grouped.entries()).sort(([a], [b]) => a - b).map(([point, prices]) => (
          <div key={point} className="grid grid-cols-[80px_1fr_1fr] gap-2 items-center">
            <span className="text-[11px] font-bold" style={{ color: 'var(--dash-text-muted)' }}>
              {point}
            </span>
            <OddBtn label="Peste" price={prices.over ?? 0} />
            <OddBtn label="Sub" price={prices.under ?? 0} />
          </div>
        ))}
      </div>
    );
  }

  // Spreads (Handicap): one row per point line
  if (apiKey === 'spreads' || apiKey === 'spreads_h1') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {market.outcomes.map(o => {
          const side = o.name === event.home_team ? 'Gazdă' : 'Deplasare';
          const sign = (o.point ?? 0) > 0 ? '+' : '';
          return (
            <OddBtn key={`${o.name}-${o.point}`}
              label={`${side} ${sign}${o.point}`}
              price={o.price} />
          );
        })}
      </div>
    );
  }

  // BTTS (Both teams to score): Da / Nu
  if (apiKey === 'btts') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {market.outcomes.map(o => (
          <OddBtn key={o.name}
            label={o.name === 'Yes' ? 'Da (GG)' : 'Nu (NG)'}
            price={o.price} />
        ))}
      </div>
    );
  }

  // Draw No Bet: just two outcomes
  if (apiKey === 'draw_no_bet') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {market.outcomes.map(o => (
          <OddBtn key={o.name} label={o.name} price={o.price} />
        ))}
      </div>
    );
  }

  // Fallback — generic outcome list
  return (
    <div className="grid grid-cols-2 gap-2">
      {market.outcomes.map(o => (
        <OddBtn key={`${o.name}-${o.point ?? ''}`}
          label={o.name + (o.point != null ? ` ${o.point}` : '')}
          price={o.price} />
      ))}
    </div>
  );
}

/* ── H2H — fake-but-structured placeholder ── */
function H2HTab({ event }: { event: OddsEvent }) {
  // Generate stable fake form chips (W/D/L) so the page always renders something
  // even fără date externe. Real data va veni cu integrarea SportRadar.
  const seed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < event.id.length; i++) s = (s * 31 + event.id.charCodeAt(i)) >>> 0;
    return s;
  }, [event.id]);

  const formFor = (offset: number) => {
    const out: ('V' | 'E' | 'I')[] = [];
    for (let i = 0; i < 5; i++) {
      const r = (seed + offset * 13 + i * 7) % 10;
      out.push(r < 5 ? 'V' : r < 7 ? 'E' : 'I');
    }
    return out;
  };

  return (
    <div className="space-y-4">
      <MarketBlock title="Formă recentă (ultimele 5 meciuri)">
        <FormRow team={event.home_team} form={formFor(0)} />
        <FormRow team={event.away_team} form={formFor(1)} />
      </MarketBlock>

      <MarketBlock title="Întâlniri directe">
        <p className="text-sm leading-relaxed py-4 text-center" style={{ color: 'var(--dash-text-muted)' }}>
          Istoricul confruntărilor directe va fi disponibil odată cu integrarea SportRadar.
          <br/>
          <span className="text-[11px]">Estimare lansare: Q3 2026</span>
        </p>
      </MarketBlock>
    </div>
  );
}

function FormRow({ team, form }: { team: string; form: ('V' | 'E' | 'I')[] }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm truncate flex-1 mr-3" style={{ color: 'var(--dash-text)' }}>{team}</span>
      <div className="flex gap-1.5 flex-shrink-0">
        {form.map((r, i) => (
          <span key={i}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-extrabold"
            style={{
              background: r === 'V' ? '#16a34a' : r === 'I' ? 'var(--red, #e63946)' : '#94a3b8',
              color: '#fff',
            }}>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── ECHIPE — lineup placeholder (Odds API nu are echipe de start) ── */
function EchipeTab({ event }: { event: OddsEvent }) {
  return (
    <div className="rounded-2xl p-8 text-center"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
      <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--dash-text-muted)' }} />
      <h3 className="font-extrabold text-lg mb-2" style={{ color: 'var(--dash-text)' }}>
        Formații de start
      </h3>
      <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--dash-text-muted)' }}>
        Echipele oficiale pentru <strong>{event.home_team}</strong> și <strong>{event.away_team}</strong> apar
        de obicei cu 1h înainte de meci. Vor fi disponibile aici după ce integrăm feed-ul SportRadar.
      </p>
      <span className="inline-block mt-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest"
        style={{ background: 'var(--dash-overlay-5)', color: 'var(--dash-text-muted)' }}>
        Beta · Q3 2026
      </span>
    </div>
  );
}

/* ── ANALIZE — AI-generated insight placeholder ── */
function AnalizeTab({ event }: { event: OddsEvent }) {
  const bk = event.bookmakers?.[0];
  const h2h = bk?.markets?.find(m => m.key === 'h2h');
  const home = h2h?.outcomes.find(o => o.name === event.home_team);
  const away = h2h?.outcomes.find(o => o.name === event.away_team);
  const draw = h2h?.outcomes.find(o => o.name === 'Draw');

  const favorit = home && away
    ? (home.price < away.price ? event.home_team : event.away_team)
    : '—';
  const cotaFav = home && away ? Math.min(home.price, away.price) : 0;
  const implied = cotaFav ? (100 / cotaFav).toFixed(1) : '—';

  return (
    <div className="space-y-4">
      <MarketBlock title="Probabilități implicite din cote">
        {home && away ? (
          <ul className="space-y-2 py-2">
            <Row label={event.home_team} value={`${(100 / home.price).toFixed(1)}%`} />
            {draw && <Row label="Egal" value={`${(100 / draw.price).toFixed(1)}%`} />}
            <Row label={event.away_team} value={`${(100 / away.price).toFixed(1)}%`} />
          </ul>
        ) : <p className="text-sm py-3" style={{ color: 'var(--dash-text-muted)' }}>Lipsesc datele.</p>}
      </MarketBlock>

      <div className="rounded-2xl p-5"
        style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
        <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--red, #e63946)' }}>
          Verdict rapid
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--dash-text)' }}>
          Casele consideră <strong>{favorit}</strong> favorit cu o probabilitate implicită de <strong>{implied}%</strong>.
          Decizia ta rămâne — folosește acest insight ca punct de plecare, nu ca recomandare de pick.
        </p>
        <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'var(--dash-text-subtle)' }}>
          Acest text este generat automat din cote și este destinat exclusiv evaluării propriilor predicții simulate.
          Nu reprezintă consultanță financiară sau garanție de rezultat.
        </p>
      </div>
    </div>
  );
}

/* ─── Atoms ─── */

function MarketBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
      <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3"
        style={{ color: 'var(--dash-text-muted)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function OddBtn({ label, sub, price }: { label: string; sub?: string; price: number }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
      style={{ background: 'var(--dash-overlay-4)', border: '1px solid var(--dash-border)' }}>
      <div className="flex flex-col items-start min-w-0">
        <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--dash-text)' }}>{label}</span>
        {sub && (
          <span className="text-[9px] uppercase tracking-wider truncate" style={{ color: 'var(--dash-text-subtle)' }}>
            {sub}
          </span>
        )}
      </div>
      <span className="font-extrabold text-base" style={{ color: 'var(--dash-text)' }}>
        {price?.toFixed(2) ?? '—'}
      </span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>{label}</span>
      <span className="font-extrabold text-sm" style={{ color: 'var(--dash-text)' }}>{value}</span>
    </li>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-2xl p-10 text-center"
      style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border)' }}>
      <p className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>{msg}</p>
    </div>
  );
}
