import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
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
  STARTER_500:    { name: 'Starter €500',     capital: 500,   price1step: 2900,  price2step: 1900,  split1step: 70, split2step: 80 },
  BASIC_1000:     { name: 'Basic €1.000',     capital: 1000,  price1step: 4900,  price2step: 3500,  split1step: 70, split2step: 80 },
  STANDARD_5000:  { name: 'Standard €5.000',  capital: 5000,  price1step: 9900,  price2step: 7400,  split1step: 70, split2step: 80 },
  ADVANCED_10000: { name: 'Advanced €10.000', capital: 10000, price1step: 17900, price2step: 13900, split1step: 75, split2step: 80 },
  PRO_25000:      { name: 'Pro €25.000',      capital: 25000, price1step: 34900, price2step: 26900, split1step: 75, split2step: 80 },
  ELITE_50000:    { name: 'Elite €50.000',    capital: 50000, price1step: 59900, price2step: 44900, split1step: 80, split2step: 80 },
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
