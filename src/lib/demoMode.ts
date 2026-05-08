/**
 * Demo mode helper. Returns true when DEMO_MODE=true OR
 * NEXT_PUBLIC_DEMO_MODE=true (so client-side reads work too).
 *
 * Use to keep marketing pages credible during pre-launch when there are zero
 * real users. After your first 50-100 funded pickers, flip this off and let
 * real data flow.
 *
 * Where it's read:
 *   - LeaderboardSection / api/clasament — if demo, returns hardcoded top 10
 *   - ReviewsWidget — already uses placeholder content, demo just gates the count
 *   - PayoutTicker — already shows fake recent payouts (no DB query yet)
 *   - api/public-stats — when demo, returns fixed marketing-friendly numbers
 */

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/** Demo leaderboard rows — used when DEMO_MODE=true */
export const DEMO_LEADERBOARD = [
  { rank: 1, username: 'AlexK_NBA',     country: '🇷🇴', plan: 'ELITE_50000',    capital: 50000, profitEur: 8420, profitPct: 16.84, durata: 47 },
  { rank: 2, username: 'MarcoS_EPL',    country: '🇮🇹', plan: 'PRO_25000',      capital: 25000, profitEur: 4120, profitPct: 16.48, durata: 38 },
  { rank: 3, username: 'JamesL_NFL',    country: '🇬🇧', plan: 'ADVANCED_10000', capital: 10000, profitEur: 1680, profitPct: 16.80, durata: 29 },
  { rank: 4, username: 'CristianB',     country: '🇷🇴', plan: 'ELITE_50000',    capital: 50000, profitEur: 7240, profitPct: 14.48, durata: 52 },
  { rank: 5, username: 'TomR_UFC',      country: '🇩🇪', plan: 'PRO_25000',      capital: 25000, profitEur: 3140, profitPct: 12.56, durata: 31 },
  { rank: 6, username: 'SofiaR_ATP',    country: '🇪🇸', plan: 'ADVANCED_10000', capital: 10000, profitEur: 1240, profitPct: 12.40, durata: 22 },
  { rank: 7, username: 'AndreiV',       country: '🇷🇴', plan: 'STANDARD_5000',  capital: 5000,  profitEur: 580,  profitPct: 11.60, durata: 18 },
  { rank: 8, username: 'LucaG_UCL',     country: '🇮🇹', plan: 'ADVANCED_10000', capital: 10000, profitEur: 1080, profitPct: 10.80, durata: 25 },
  { rank: 9, username: 'MihaiD',        country: '🇷🇴', plan: 'STANDARD_5000',  capital: 5000,  profitEur: 480,  profitPct: 9.60,  durata: 21 },
  { rank: 10,username: 'AnaT_NBA',      country: '🇷🇴', plan: 'BASIC_1000',     capital: 1000,  profitEur: 92,   profitPct: 9.20,  durata: 12 },
];

/** Demo public stats — used by /api/public-stats when DEMO_MODE=true */
export const DEMO_PUBLIC_STATS = {
  users:       25_400,
  funded:      1_240,
  payoutsEur:  1_240_000,
  profitSplit: 80,
};
