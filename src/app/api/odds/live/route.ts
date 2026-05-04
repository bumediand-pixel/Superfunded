import { NextRequest, NextResponse } from 'next/server';
import { getCoteLive } from '@/lib/odds-api';

export async function GET(req: NextRequest) {
  const sport = req.nextUrl.searchParams.get('sport') || 'soccer_epl';
  const data = await getCoteLive(sport);
  return NextResponse.json(data);
}
