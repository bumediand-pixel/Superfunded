/**
 * Scaling — funded users who hit consistent payouts can upgrade to a larger account.
 * Eligibility (industry standard): funded for >= 30 days AND >= 10% total profit.
 * Upgrade price = (target tier price) - 50% credit on current tier.
 */
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANURI_STRIPE, type PlanId } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ScaleSchema = z.object({
  contId: z.string().min(1),
  targetPlan: z.enum(['BASIC_1000','STANDARD_5000','ADVANCED_10000','PRO_25000','ELITE_50000']),
});

const TIER_ORDER: PlanId[] = ['STARTER_500','BASIC_1000','STANDARD_5000','ADVANCED_10000','PRO_25000','ELITE_50000'];

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautentificat' }, { status: 401 });

  const parsed = ScaleSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const utilizator = await prisma.utilizator.findUnique({ where: { supabaseId: user.id } });
  if (!utilizator) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });

  const cont = await prisma.contTrader.findFirst({
    where: { id: parsed.data.contId, utilizatorId: utilizator.id },
  });
  if (!cont) return NextResponse.json({ error: 'Cont nu îți aparține' }, { status: 403 });

  // Eligibility checks
  if (cont.statusEvaluare !== 'FINANTAT') {
    return NextResponse.json({ error: 'Scaling disponibil doar pentru conturi FINANTAT' }, { status: 400 });
  }
  const fundedDays = cont.dataFinalizare
    ? (Date.now() - cont.dataFinalizare.getTime()) / 86_400_000
    : 0;
  if (fundedDays < 30) {
    return NextResponse.json({ error: 'Scaling disponibil după 30 zile pe cont funded', fundedDays }, { status: 400 });
  }
  const profitPct = cont.profitTotal / cont.capitalInceput;
  if (profitPct < 0.10) {
    return NextResponse.json({ error: 'Necesar >=10% profit pe contul curent', profitPct }, { status: 400 });
  }

  const currentIdx = TIER_ORDER.indexOf(cont.plan as PlanId);
  const targetIdx  = TIER_ORDER.indexOf(parsed.data.targetPlan);
  if (targetIdx <= currentIdx) {
    return NextResponse.json({ error: 'Trebuie un plan superior celui curent' }, { status: 400 });
  }

  const targetInfo  = PLANURI_STRIPE[parsed.data.targetPlan];
  const currentInfo = PLANURI_STRIPE[cont.plan as PlanId];
  if (!targetInfo || !currentInfo) return NextResponse.json({ error: 'Plan invalid' }, { status: 400 });

  // Upgrade price = target 2step - 50% credit on current 2step
  const upgradePrice = Math.max(0, targetInfo.price2step - Math.round(currentInfo.price2step * 0.5));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `SuperFunded Scale — ${currentInfo.name} → ${targetInfo.name}`,
          description: `Upgrade contul ${cont.id} la €${targetInfo.capital}. 50% credit pentru contul curent.`,
        },
        unit_amount: upgradePrice,
      },
      quantity: 1,
    }],
    metadata: {
      userId: user.id,
      kind: 'scale',
      contId: cont.id,
      plan: parsed.data.targetPlan,
      previousPlan: cont.plan,
      capital: targetInfo.capital.toString(),
    },
    customer_email: user.email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&scaled=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?scale_cancelled=true`,
  });

  return NextResponse.json({ url: session.url, price: upgradePrice / 100, fundedDays, profitPct });
}
