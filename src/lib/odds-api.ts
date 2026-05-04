const ODDS_API_KEY = process.env.ODDS_API_KEY!;
const BASE = 'https://api.the-odds-api.com/v4';

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

export async function getCoteLive(sport: string, region = 'eu') {
  const res = await fetch(
    `${BASE}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=h2h,spreads,totals&oddsFormat=decimal`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getSporturi() {
  const res = await fetch(
    `${BASE}/sports/?apiKey=${ODDS_API_KEY}&all=true`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}
