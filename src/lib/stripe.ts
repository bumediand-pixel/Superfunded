import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set. See .env.local.example.');
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' as any });
  }
  return _stripe;
}

// Lazy proxy — defers initialization until first use so the build doesn't fail when env vars are absent.
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return Reflect.get(getStripeClient(), prop);
  },
});

export const PLANURI_STRIPE: Record<string, { price: number; name: string; capital: number; split: number }> = {
  STARTER_500:    { price: 3900,  name: 'Starter €500',    capital: 500,   split: 70 },
  BASIC_1000:     { price: 5900,  name: 'Basic €1.000',    capital: 1000,  split: 70 },
  STANDARD_5000:  { price: 12900, name: 'Standard €5.000', capital: 5000,  split: 75 },
  ADVANCED_10000: { price: 22900, name: 'Advanced €10.000',capital: 10000, split: 75 },
  PRO_25000:      { price: 44900, name: 'Pro €25.000',     capital: 25000, split: 80 },
  ELITE_50000:    { price: 74900, name: 'Elite €50.000',   capital: 50000, split: 80 },
};
