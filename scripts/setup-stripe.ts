/**
 * Idempotent Stripe Products setup. Creates one Product per (PlanId × Mode) and one
 * Price per Product, so they show up properly in Customer Portal + invoices.
 *
 * Run with: `npx tsx scripts/setup-stripe.ts`
 *
 * Requires STRIPE_SECRET_KEY in environment. Safe to re-run — looks up existing
 * products by metadata.sf_id before creating.
 */
import 'dotenv/config';
import Stripe from 'stripe';
import { PLANURI_STRIPE, type PlanId, type ChallengeMode } from '../src/lib/stripe';

const SECRET = process.env.STRIPE_SECRET_KEY;
if (!SECRET) {
  console.error('Missing STRIPE_SECRET_KEY in environment');
  process.exit(1);
}

const stripe = new Stripe(SECRET, { apiVersion: '2026-04-22.dahlia' as any });

const PLAN_IDS: PlanId[] = ['STARTER_500','BASIC_1000','STANDARD_5000','ADVANCED_10000','PRO_25000','ELITE_50000'];
const MODES: ChallengeMode[] = ['1step', '2step'];

async function findExistingProduct(sfId: string): Promise<Stripe.Product | null> {
  // Stripe doesn't support metadata search via the standard list call without the
  // search API, so we list and filter by metadata.
  const products = await stripe.products.list({ limit: 100, active: true });
  return products.data.find(p => p.metadata.sf_id === sfId) ?? null;
}

async function ensureProduct(plan: PlanId, mode: ChallengeMode) {
  const info = PLANURI_STRIPE[plan];
  const sfId = `${plan}_${mode}`;
  const name = `SuperFunded — ${info.name} (${mode === '1step' ? '1-Step' : '2-Step'})`;
  const price = mode === '1step' ? info.price1step : info.price2step;
  const split = mode === '1step' ? info.split1step : info.split2step;

  let product = await findExistingProduct(sfId);
  if (!product) {
    product = await stripe.products.create({
      name,
      description: `Capital virtual €${info.capital.toLocaleString('ro-RO')} · Profit split ${split}% · ${mode === '1step' ? 'Target 40%' : 'Target 30% + 20%'}`,
      metadata: {
        sf_id: sfId,
        plan, mode,
        capital: info.capital.toString(),
        split: split.toString(),
      },
    });
    console.log(`✓ Created product: ${name} (${product.id})`);
  } else {
    console.log(`= Product exists: ${name} (${product.id})`);
  }

  // Ensure a single active recurring-style one-time price
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
  const existingMatch = prices.data.find(p => p.unit_amount === price && p.currency === 'eur');
  if (!existingMatch) {
    // Deactivate old prices that don't match (Stripe forbids deleting prices)
    for (const p of prices.data) {
      await stripe.prices.update(p.id, { active: false });
    }
    const created = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: 'eur',
      metadata: { sf_id: sfId },
    });
    console.log(`  ✓ New price €${(price / 100).toFixed(2)} (${created.id})`);
  } else {
    console.log(`  = Price OK €${(price / 100).toFixed(2)} (${existingMatch.id})`);
  }
}

async function main() {
  console.log(`🔧 Setting up Stripe Products for SuperFunded (mode: ${SECRET.startsWith('sk_test_') ? 'TEST' : 'LIVE'})\n`);
  for (const plan of PLAN_IDS) {
    for (const mode of MODES) {
      await ensureProduct(plan, mode);
    }
  }
  console.log('\n✅ Done. Products visible in Stripe Dashboard → Products.');
  console.log('   Customers will now see proper line items in Portal + invoices.');
}

main().catch(err => { console.error(err); process.exit(1); });
