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

export async function getCoteLive(sport: string, region = 'eu'): Promise<OddsEvent[]> {
  if (!ODDS_API_KEY) return [];
  const res = await fetch(
    `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=h2h,spreads,totals&oddsFormat=decimal`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    console.error('[odds-api] getCoteLive failed:', res.status, await res.text());
    return [];
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
