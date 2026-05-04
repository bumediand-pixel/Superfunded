import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`kyc-token:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  // Ignore client-supplied userId — always use the authenticated user's ID
  const userId = user.id;

  const ts = Math.floor(Date.now() / 1000).toString();
  const method = 'POST';
  const path = `/resources/accessTokens?userId=${userId}&levelName=basic-kyc-level`;

  const signature = crypto
    .createHmac('sha256', process.env.SUMSUB_SECRET_KEY!)
    .update(ts + method + path)
    .digest('hex');

  const response = await fetch(`https://api.sumsub.com${path}`, {
    method: 'POST',
    headers: {
      'X-App-Token': process.env.SUMSUB_APP_TOKEN!,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!data.token) return NextResponse.json({ error: 'KYC token unavailable' }, { status: 502 });
  return NextResponse.json({ token: data.token });
}
