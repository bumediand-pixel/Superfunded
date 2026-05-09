// Compliance: AML rule table for SuperFunded.
// Pure data — no logic here. Engine lives elsewhere.
// Each rule maps to a monitoring scenario; thresholds are RON / EUR cutoffs
// agreed with compliance. Lawyer review required before go-live.

export type AmlAction =
  | 'REVIEW' // queue for manual analyst review
  | 'BLOCK' // block transaction immediately
  | 'SAR' // file Suspicious Activity Report (ONPCSB)
  | 'KYC_UPLIFT' // request enhanced due diligence (L2 -> L3)
  | 'FREEZE'; // freeze account, mandatory analyst sign-off to unfreeze

export type AmlRule = {
  id: string; // R01..R12
  name: string;
  /** Time window in hours; undefined = no window (lifetime / single tx). */
  window?: number;
  /** Threshold value (EUR unless noted otherwise). */
  threshold?: number;
  action: AmlAction;
  description?: string;
};

export const AML_RULES: readonly AmlRule[] = [
  {
    id: 'R01',
    name: 'High single deposit',
    threshold: 2_000,
    action: 'REVIEW',
    description: 'Single deposit >= EUR 2,000 -> manual review.',
  },
  {
    id: 'R02',
    name: 'Cumulative deposits 24h',
    window: 24,
    threshold: 5_000,
    action: 'REVIEW',
    description: 'Sum of deposits in 24h >= EUR 5,000.',
  },
  {
    id: 'R03',
    name: 'Cumulative deposits 30d',
    window: 24 * 30,
    threshold: 15_000,
    action: 'KYC_UPLIFT',
    description: '30-day deposits >= EUR 15,000 -> request EDD (source of funds).',
  },
  {
    id: 'R04',
    name: 'Structuring (smurfing)',
    window: 24,
    threshold: 1_900,
    action: 'REVIEW',
    description: '3+ deposits between EUR 900-1,900 in 24h (just under R01).',
  },
  {
    id: 'R05',
    name: 'Rapid deposit-then-withdraw',
    window: 24,
    threshold: 1_000,
    action: 'REVIEW',
    description: 'Deposit >= EUR 1,000 followed by withdrawal of >=80% within 24h with low betting activity.',
  },
  {
    id: 'R06',
    name: 'Withdrawal to different beneficiary',
    action: 'BLOCK',
    description:
      'Withdrawal target IBAN/card differs from deposit source -> hard block until KYC verified ownership.',
  },
  {
    id: 'R07',
    name: 'PEP / sanctions match',
    action: 'FREEZE',
    description:
      'Sumsub returns PEP=true or sanctions list hit -> freeze account, escalate to MLRO within 24h.',
  },
  {
    id: 'R08',
    name: 'High-risk jurisdiction IP',
    action: 'KYC_UPLIFT',
    description:
      'Login or deposit from FATF high-risk jurisdiction (or VPN exit there) -> require live re-KYC.',
  },
  {
    id: 'R09',
    name: 'Multiple accounts per identity',
    action: 'FREEZE',
    description:
      'Same CNP / device fingerprint / payment instrument across 2+ accounts -> freeze and consolidate.',
  },
  {
    id: 'R10',
    name: 'Card chargeback',
    action: 'FREEZE',
    description:
      'Stripe dispute (fraud reason) -> freeze account, refund hold, refer to fraud team.',
  },
  {
    id: 'R11',
    name: 'Source-of-funds threshold',
    threshold: 10_000,
    action: 'KYC_UPLIFT',
    description:
      'Lifetime deposits >= EUR 10,000 -> require documented source of funds (payslips / contract / bank statement).',
  },
  {
    id: 'R12',
    name: 'SAR trigger — confirmed suspicion',
    action: 'SAR',
    description:
      'Analyst-confirmed suspicion of money laundering / terrorism financing -> file report with ONPCSB within 24h.',
  },
] as const;

export const AML_RULES_BY_ID: Readonly<Record<string, AmlRule>> = Object.freeze(
  AML_RULES.reduce<Record<string, AmlRule>>((acc, r) => {
    acc[r.id] = r;
    return acc;
  }, {}),
);
