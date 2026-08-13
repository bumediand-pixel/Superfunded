import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANURI_STRIPE, priceFor, splitFor, type PlanId, type ChallengeMode } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { rateLimit } from '@/lib/rateLimiter';

const CheckoutSchema = z.object({
  plan: z.enum(['STARTER_500', 'BASIC_1000', 'STANDARD_5000', 'ADVANCED_10000', 'PRO_25000', 'ELITE_50000']),
  mode: z.enum(['1step', '2step']).default('2step'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`checkout:${ip}`, 10, 60 * 60 * 1000)) {
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

  const parsed = CheckoutSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Plan invalid' }, { status: 400 });
  const { plan, mode } = parsed.data;

  const planInfo = PLANURI_STRIPE[plan as PlanId];
  if (!planInfo) return NextResponse.json({ error: 'Plan invalid' }, { status: 400 });

  const amount = priceFor(plan as PlanId, mode as ChallengeMode);
  const split = splitFor(plan as PlanId, mode as ChallengeMode);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `SuperFunded — ${planInfo.name} (${mode === '1step' ? '1-Step' : '2-Step'})`,
          description: `Capital: €${planInfo.capital.toLocaleString('ro-RO')} · Split: ${split}% · Target ${mode === '1step' ? '40%' : '30%+20%'}`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    metadata: {
      userId: user.id,
      plan,
      mode,
      capital: planInfo.capital.toString(),
      split: split.toString(),
      skillEvalConsentAt: new Date().toISOString(),
    },
    customer_email: user.email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan_activat=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planuri?anulat=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return NextResponse.json({ url: session.url });
}
