import { NextRequest, NextResponse } from 'next/server';
import { getEventOdds } from '@/lib/odds-api';

/**
 * GET /api/odds/event/[id]?sport=soccer_epl
 *
 * Returns full market depth for a single match (h2h, spreads, totals, btts,
 * draw_no_bet, half-time markets). Cached 60s upstream so a refresh-spam user
 * doesn't burn the API quota.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sport = req.nextUrl.searchParams.get('sport');

  if (!sport) {
    return NextResponse.json(
      { event: null, status: 'bad_request', message: 'sport query param required' },
      { status: 400 }
    );
  }

  if (!process.env.ODDS_API_KEY) {
    return NextResponse.json(
      { event: null, status: 'unconfigured' },
      { status: 200, headers: { 'cache-control': 'no-store' } }
    );
  }

  try {
    const event = await getEventOdds(sport, id);
    return NextResponse.json(
      { event, status: event ? 'ok' : 'not_found' },
      { headers: { 'cache-control': 'public, max-age=30, s-maxage=60' } }
    );
  } catch (err) {
    console.error('[api/odds/event]', err);
    return NextResponse.json(
      { event: null, status: 'upstream_error' },
      { status: 200 }
    );
  }
}
