/**
 * The Odds API v4 wrapper.
 *
 * IMPORTANT: every extra `markets=` value sent in the URL costs an additional
 * API request from your monthly quota. Don't request more than needed.
 *
 * Free / cheap markets: h2h, spreads, totals.
 * Mid-tier markets:     btts, draw_no_bet, h2h_h1, totals_h1, spreads_h1.
 * Expensive markets:    alternate_*, team_totals_*, player_props (NFL/NBA).
 *
 * Strategy: `getCoteLive()` fetches a small set for the listing grid.
 * `getEventOdds()` fetches a richer set for a single match detail page,
 * where the cost is justified because the user explicitly opened that match.
 */

const ODDS_API_KEY = process.env.ODDS_API_KEY ?? '';
const BASE = 'https://api.the-odds-api.com/v4';

export type Outcome = { name: string; price: number; point?: number };
export type Bookmaker = { key: string; title: string; markets: { key: string; outcomes: Outcome[] }[] };
export type OddsEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
};

export type ScoreEvent = {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  completed: boolean;
  scores?: { name: string; score: string }[] | null;
};

export const SPORTURI_DISPONIBILE = [
  { key: 'soccer_epl',              nume: 'Premier League',      icon: '⚽' },
  { key: 'soccer_la_liga',          nume: 'La Liga',             icon: '⚽' },
  { key: 'soccer_romania_liga1',    nume: 'Liga 1 România',      icon: '⚽' },
  { key: 'soccer_uefa_champs_league', nume: 'Champions League',  icon: '⚽' },
  { key: 'tennis_atp_french_open',  nume: 'Tenis ATP',           icon: '🎾' },
  { key: 'basketball_euroleague',   nume: 'Euroleague',          icon: '🏀' },
  { key: 'basketball_nba',          nume: 'NBA',                 icon: '🏀' },
  { key: 'mma_mixed_martial_arts',  nume: 'MMA / UFC',           icon: '🥊' },
  { key: 'rugbyleague_nrl',         nume: 'Rugby',               icon: '🏉' },
];

/** Markets fetched for the listing grid (small to save quota). */
const LISTING_MARKETS = 'h2h,spreads,totals';

/** Markets fetched on match-detail page — wider but still budget-friendly. */
const DETAIL_MARKETS = [
  'h2h',           // 1X2 / moneyline — Cine câștigă
  'spreads',       // Handicap european
  'totals',        // Total goluri (over/under)
  'btts',          // Both teams to score — Ambele echipe marchează (GG)
  'draw_no_bet',   // Egal — pariul se rambursează (DNB)
  'h2h_h1',        // 1X2 prima repriză
  'totals_h1',     // Total goluri prima repriză
  'spreads_h1',    // Handicap prima repriză
].join(',');

export async function getCoteLive(sport: string, region = 'eu'): Promise<OddsEvent[]> {
  if (!ODDS_API_KEY) return [];
  const res = await fetch(
    `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=${LISTING_MARKETS}&oddsFormat=decimal`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    console.error('[odds-api] getCoteLive failed:', res.status, await res.text());
    return [];
  }
  return res.json();
}

/** Fetch full market depth for a single event. */
export async function getEventOdds(
  sport: string,
  eventId: string,
  region = 'eu',
): Promise<OddsEvent | null> {
  if (!ODDS_API_KEY) return null;
  const res = await fetch(
    `${BASE}/sports/${sport}/events/${eventId}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=${DETAIL_MARKETS}&oddsFormat=decimal`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    console.error('[odds-api] getEventOdds failed:', res.status, await res.text());
    return null;
  }
  return res.json();
}

export async function getSporturi() {
  if (!ODDS_API_KEY) return [];
  const res = await fetch(
    `${BASE}/sports/?apiKey=${ODDS_API_KEY}&all=true`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

/** Fetch scores for completed events from the past `daysFrom` days (1-3 typical). */
export async function getScores(sport: string, daysFrom = 2): Promise<ScoreEvent[]> {
  if (!ODDS_API_KEY) return [];
  const res = await fetch(
    `${BASE}/sports/${sport}/scores/?apiKey=${ODDS_API_KEY}&daysFrom=${daysFrom}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    console.error('[odds-api] getScores failed:', res.status);
    return [];
  }
  return res.json();
}

/* ────────────────────────────────────────────────────────────────────────
 * Market taxonomy — maps raw Odds API market keys to user-facing labels
 * grouped by category, so the UI can render Superbet-style tabbed groups.
 * Markets that the API does NOT provide are marked `available: false` so
 * the UI can show them as "în curând" instead of pretending they exist.
 * ────────────────────────────────────────────────────────────────────── */

export type MarketCategory =
  | 'principale'   // Cine câștigă, 1X2, handicap, total goluri
  | 'prima_repriza'
  | 'a_doua_repriza'
  | 'goluri'       // GG, scor corect, exact, interval
  | 'jucator'      // Player props — marcator, cartonaș
  | 'cornere'      // Corner markets (not in free Odds API tier)
  | 'cartonase'    // Card markets (not in free Odds API tier)
  | 'speciale'     // VAR, super sub, exotic markets
  | 'combo'        // 1X2 & Total, Șansă dublă & GG, etc.
  ;

export type MarketDef = {
  /** Key as returned by The Odds API; null if we can't fetch it. */
  apiKey: string | null;
  /** Romanian label shown to user. */
  label: string;
  /** Category bucket for tab grouping. */
  category: MarketCategory;
  /** Whether we currently surface this market live. */
  available: boolean;
};

export const MARKET_CATALOG: MarketDef[] = [
  // ── Principale ─────────────────────────────────────────────────────
  { apiKey: 'h2h',          label: '1X2 · Cine câștigă',              category: 'principale', available: true  },
  { apiKey: 'spreads',      label: 'Handicap european',               category: 'principale', available: true  },
  { apiKey: 'totals',       label: 'Total goluri (Peste / Sub)',      category: 'principale', available: true  },
  { apiKey: 'draw_no_bet',  label: 'Egal — pariul se rambursează (DNB)', category: 'principale', available: true },
  { apiKey: null,           label: 'Șansă dublă (1X / X2 / 12)',      category: 'principale', available: false },
  { apiKey: null,           label: 'Handicap asiatic',                category: 'principale', available: false },

  // ── Goluri ─────────────────────────────────────────────────────────
  { apiKey: 'btts',         label: 'Ambele echipe marchează (GG)',    category: 'goluri',     available: true  },
  { apiKey: null,           label: 'Scor corect',                     category: 'goluri',     available: false },
  { apiKey: null,           label: 'Număr exact de goluri',           category: 'goluri',     available: false },
  { apiKey: null,           label: 'Total goluri impar/par',          category: 'goluri',     available: false },
  { apiKey: null,           label: 'Interval goluri',                 category: 'goluri',     available: false },

  // ── Prima repriză ──────────────────────────────────────────────────
  { apiKey: 'h2h_h1',       label: 'Prima repriză · 1X2',             category: 'prima_repriza', available: true  },
  { apiKey: 'totals_h1',    label: 'Prima repriză · Total goluri',    category: 'prima_repriza', available: true  },
  { apiKey: 'spreads_h1',   label: 'Prima repriză · Handicap',        category: 'prima_repriza', available: true  },
  { apiKey: null,           label: 'Prima repriză · Scor corect',     category: 'prima_repriza', available: false },
  { apiKey: null,           label: 'Prima repriză · Ambele marchează', category: 'prima_repriza', available: false },

  // ── A doua repriză ─────────────────────────────────────────────────
  { apiKey: null,           label: 'A doua repriză · 1X2',            category: 'a_doua_repriza', available: false },
  { apiKey: null,           label: 'A doua repriză · Total goluri',   category: 'a_doua_repriza', available: false },
  { apiKey: null,           label: 'Pauză / Final',                   category: 'a_doua_repriza', available: false },

  // ── Cornere ────────────────────────────────────────────────────────
  { apiKey: null,           label: 'Total cornere',                   category: 'cornere',    available: false },
  { apiKey: null,           label: 'Handicap cornere',                category: 'cornere',    available: false },
  { apiKey: null,           label: 'Prima echipă cu corner',          category: 'cornere',    available: false },

  // ── Cartonașe ──────────────────────────────────────────────────────
  { apiKey: null,           label: 'Total cartonașe',                 category: 'cartonase',  available: false },
  { apiKey: null,           label: 'Cartonaș roșu în meci',           category: 'cartonase',  available: false },
  { apiKey: null,           label: 'Prima echipă cu cartonaș',        category: 'cartonase',  available: false },

  // ── Jucător ────────────────────────────────────────────────────────
  { apiKey: null,           label: 'Marcator în meci',                category: 'jucator',    available: false },
  { apiKey: null,           label: 'Primul marcator',                 category: 'jucator',    available: false },
  { apiKey: null,           label: 'Ultimul marcator',                category: 'jucator',    available: false },

  // ── Combos ─────────────────────────────────────────────────────────
  { apiKey: null,           label: '1X2 & Total goluri',              category: 'combo',      available: false },
  { apiKey: null,           label: 'Șansă dublă & GG',                category: 'combo',      available: false },
  { apiKey: null,           label: '1X2 & Ambele marchează',          category: 'combo',      available: false },

  // ── Speciale ───────────────────────────────────────────────────────
  { apiKey: null,           label: 'VAR review în meci',              category: 'speciale',   available: false },
  { apiKey: null,           label: 'Penalty acordat',                 category: 'speciale',   available: false },
  { apiKey: null,           label: 'Gol din lovitură liberă',         category: 'speciale',   available: false },
];

export const MARKET_CATEGORY_LABELS: Record<MarketCategory, string> = {
  principale:      'Principale',
  prima_repriza:   'Prima repriză',
  a_doua_repriza:  'A doua repriză',
  goluri:          'Goluri',
  jucator:         'Jucător',
  cornere:         'Cornere',
  cartonase:       'Cartonașe',
  speciale:        'Speciale',
  combo:           'Combo',
};

/** Convenience: returns markets in a category, available first then unavailable (sorted for stable UI). */
export function marketsForCategory(cat: MarketCategory): MarketDef[] {
  return MARKET_CATALOG.filter(m => m.category === cat).sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    return 0;
  });
}
