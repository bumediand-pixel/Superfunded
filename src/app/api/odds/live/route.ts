import { NextRequest, NextResponse } from 'next/server';
import { getCoteLive } from '@/lib/odds-api';

/**
 * Returns live odds for a sport. Wraps `getCoteLive` so the client can tell
 * the difference between "no events available" (empty array) and "API key
 * missing / upstream rate-limited" (status field).
 */
export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get('sport') || 'soccer_epl';

  if (!process.env.ODDS_API_KEY) {
    return NextResponse.json(
      { events: [], status: 'unconfigured', message: 'ODDS_API_KEY missing on server.' },
      { status: 200, headers: { 'cache-control': 'no-store' } }
    );
  }

  try {
    const events = await getCoteLive(sport);
    return NextResponse.json(
      { events, status: events.length === 0 ? 'empty' : 'ok' },
      { headers: { 'cache-control': 'public, max-age=30, s-maxage=60' } }
    );
  } catch (err) {
    console.error('[api/odds/live]', err);
    return NextResponse.json(
      { events: [], status: 'upstream_error', message: 'The Odds API request failed.' },
      { status: 200 }
    );
  }
}
