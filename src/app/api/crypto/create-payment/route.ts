/**
 * POST /api/crypto/create-payment
 * Body: { plan: PlanId, mode: '1step' | '2step' }
 *
 * Creează o factură hosted pe NOWPayments. Returnează URL la care
 * redirecționăm userul ca să plătească cu USDT / BTC / ETH / etc.
 *
 * Flow:
 *   1) User autentificat → primim user.id din Supabase
 *   2) Validăm plan + mode → calculăm prețul în EUR
 *   3) NOWPayments creează invoice cu `order_id = ${userId}:${plan}:${mode}`
 *   4) Returnăm `invoice_url` → frontend face window.location.href
 *   5) După plată, NOWPayments lovește /api/crypto/webhook care provizionează
 *      contul (același cod ca în Stripe webhook).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createInvoice } from '@/lib/nowpayments';
import { PLANURI_STRIPE, priceFor, type PlanId, type ChallengeMode } from '@/lib/stripe';
import { rateLimit } from '@/lib/rateLimiter';

const Body = z.object({
  plan: z.enum(['STARTER_500', 'BASIC_1000', 'STANDARD_5000', 'ADVANCED_10000', 'PRO_25000', 'ELITE_50000']),
  mode: z.enum(['1step', '2step']),
});

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`crypto-create:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe cereri' }, { status: 429 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 });
  }
  const { plan, mode } = parsed.data as { plan: PlanId; mode: ChallengeMode };
  const info = PLANURI_STRIPE[plan];
  const priceCents = priceFor(plan, mode);
  const priceEur = priceCents / 100;

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://thesuperfunded.com';
  const orderId = `${user.id}:${plan}:${mode}:${Date.now()}`;

  try {
    const invoice = await createInvoice({
      orderId,
      priceAmount: priceEur,
      description: `${info.name} · ${mode === '1step' ? '1-Pas' : '2-Pași'}`,
      successUrl: `${SITE}/dashboard?crypto=ok&order=${encodeURIComponent(orderId)}`,
      cancelUrl: `${SITE}/planuri?crypto=cancel`,
      customerEmail: user.email ?? undefined,
    });
    return NextResponse.json({ url: invoice.invoice_url, orderId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Eroare neașteptată';
    console.error('[crypto/create-payment]', msg);
    // Distinguish missing API key from upstream failure so we can hint the user.
    if (msg.includes('NOWPAYMENTS_API_KEY missing')) {
      return NextResponse.json(
        { error: 'Plata crypto nu e încă activă. Folosește plata cu cardul sau revino mai târziu.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: 'Procesatorul crypto a refuzat cererea.' }, { status: 502 });
  }
}
