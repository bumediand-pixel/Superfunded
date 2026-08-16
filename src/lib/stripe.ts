/**
 * Server-only Stripe client. Wrapped lazily so client components that
 * import the pricing constants below don't trigger SDK instantiation in the
 * browser (which crashes: "Neither apiKey nor config.authenticator provided").
 *
 * Use `getStripe()` from API routes / webhooks. The legacy `stripe` export is
 * a Proxy that only resolves to the real client on first property access,
 * which never happens in the browser.
 */
import Stripe from 'stripe';

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: '2026-04-22.dahlia' as any,
    });
  }
  return _stripe;
}
export const stripe = new Proxy({} as Stripe, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_t, prop) { return (getStripe() as any)[prop]; },
});

export type PlanId =
  | 'STARTER_500'
  | 'BASIC_1000'
  | 'STANDARD_5000'
  | 'ADVANCED_10000'
  | 'PRO_25000'
  | 'ELITE_50000';

export type ChallengeMode = '1step' | '2step';

export type PlanInfo = {
  name: string;
  capital: number;
  /** price in cents (EUR) */
  price1step: number;
  price2step: number;
  split1step: number;
  split2step: number;
};

export const PLANURI_STRIPE: Record<PlanId, PlanInfo> = {
  // Prices mirror thefundedpick.com/#pricing (USD→EUR parity), 70% split on 1-step,
  // 80% on 2-step. €500 tier is 2-step-only upstream — we keep a 1-step option at
  // half the €1k 1-step fee for ladder consistency. Values are EUR cents.
  STARTER_500:    { name: 'Starter €500',     capital: 500,   price1step: 1700,   price2step: 1900,  split1step: 70, split2step: 80 },
  BASIC_1000:     { name: 'Basic €1.000',     capital: 1000,  price1step: 4900,   price2step: 3400,  split1step: 70, split2step: 80 },
  STANDARD_5000:  { name: 'Standard €5.000',  capital: 5000,  price1step: 20499,  price2step: 15400, split1step: 70, split2step: 80 },
  ADVANCED_10000: { name: 'Advanced €10.000', capital: 10000, price1step: 38999,  price2step: 29400, split1step: 70, split2step: 80 },
  PRO_25000:      { name: 'Pro €25.000',      capital: 25000, price1step: 70999,  price2step: 53400, split1step: 70, split2step: 80 },
  ELITE_50000:    { name: 'Elite €50.000',    capital: 50000, price1step: 124999, price2step: 94400, split1step: 70, split2step: 80 },
};

export function priceFor(plan: PlanId, mode: ChallengeMode): number {
  const info = PLANURI_STRIPE[plan];
  return mode === '1step' ? info.price1step : info.price2step;
}

export function splitFor(plan: PlanId, mode: ChallengeMode): number {
  const info = PLANURI_STRIPE[plan];
  return mode === '1step' ? info.split1step : info.split2step;
}

/** Phase rule definition used when seeding RegulaCont rows after a successful checkout */
export type PhaseRule = {
  numeFaza: string;
  /** profit target as a fraction of starting capital (e.g. 0.40 = 40%) */
  targetProfit: number;
  /** max total drawdown as a fraction (e.g. 0.08 = 8%) */
  maxPierdere: number;
  /** max daily loss as a fraction (e.g. 0.05 = 5%) */
  maxZilnic: number;
  /** minimum trading days required */
  zileMinime: number;
};

export function rulesForMode(mode: ChallengeMode): PhaseRule[] {
  if (mode === '1step') {
    return [
      { numeFaza: 'Faza 1', targetProfit: 0.40, maxPierdere: 0.08, maxZilnic: 0.05, zileMinime: 0 },
    ];
  }
  return [
    { numeFaza: 'Faza 1', targetProfit: 0.30, maxPierdere: 0.08, maxZilnic: 0.05, zileMinime: 0 },
    { numeFaza: 'Faza 2', targetProfit: 0.20, maxPierdere: 0.08, maxZilnic: 0.05, zileMinime: 0 },
  ];
}
