/**
 * AML rule table — pure data, no runtime logic.
 *
 * Each rule corresponds to a paragraph from the AML policy memo and to a
 * detection that the transaction-monitoring worker (see docs/compliance/
 * aml-policy.md) is expected to implement. Keep this file as the single
 * source of truth: tests assert on it, the admin dashboard renders it,
 * and the policy doc references the rule IDs.
 *
 * Action vocabulary:
 *   - flag        : create an internal alert, no user-facing impact
 *   - hold        : freeze the offending withdrawal pending manual review
 *   - block       : block the user from making further withdrawals
 *   - sar         : escalate to compliance officer for ONPCSB filing
 *   - sar_24h     : SAR escalation with the 24h regulatory deadline
 *   - kyc_refresh : require updated KYC documents before next action
 */

export type AMLAction =
  | 'flag'
  | 'hold'
  | 'block'
  | 'sar'
  | 'sar_24h'
  | 'kyc_refresh';

export type AMLRule = {
  /** Stable identifier used in alerts, dashboards, and the AML memo. */
  id:
    | 'R01' | 'R02' | 'R03' | 'R04' | 'R05' | 'R06'
    | 'R07' | 'R08' | 'R09' | 'R10' | 'R11' | 'R12';
  /** Human-readable rule name (RO). */
  name: string;
  /** Rolling window in hours for the threshold check. Omit for non-windowed rules. */
  window?: number;
  /** Threshold in EUR for amount-based rules; omit for behavioural rules. */
  threshold?: number;
  /** Action to take when the rule fires. */
  action: AMLAction;
};

export const AML_RULES: readonly AMLRule[] = [
  {
    id: 'R01',
    name: 'Tranzacție unică ≥ 10.000 EUR (CTR)',
    threshold: 10_000,
    action: 'sar_24h',
  },
  {
    id: 'R02',
    name: 'Cumul retrageri ≥ 10.000 EUR în 24h (structuring)',
    window: 24,
    threshold: 10_000,
    action: 'sar_24h',
  },
  {
    id: 'R03',
    name: 'Cumul retrageri ≥ 15.000 EUR în 7 zile',
    window: 24 * 7,
    threshold: 15_000,
    action: 'sar',
  },
  {
    id: 'R04',
    name: 'Tranzacții multiple chiar sub prag (smurfing): ≥ 3 retrageri între 9.000-9.999 EUR în 30 zile',
    window: 24 * 30,
    threshold: 9_000,
    action: 'sar',
  },
  {
    id: 'R05',
    name: 'Mismatch geografic: IP login vs. țară IBAN/wallet pe 3 sesiuni consecutive',
    action: 'kyc_refresh',
  },
  {
    id: 'R06',
    name: 'Schimbare rapidă IBAN / wallet (≥ 2 modificări în 14 zile)',
    window: 24 * 14,
    threshold: 2,
    action: 'hold',
  },
  {
    id: 'R07',
    name: 'Plată cu card 3DS eșuat de ≥ 3 ori în 24h',
    window: 24,
    threshold: 3,
    action: 'block',
  },
  {
    id: 'R08',
    name: 'PEP (politically exposed person) sau rudă PEP detectat la KYC',
    action: 'sar',
  },
  {
    id: 'R09',
    name: 'Țară sancționată (UE / OFAC / FATF blacklist) la IP, IBAN sau wallet',
    action: 'block',
  },
  {
    id: 'R10',
    name: 'Tipar de pariere artificial (cote ≈ 1.01 repetate, hedging extern suspectat)',
    action: 'flag',
  },
  {
    id: 'R11',
    name: 'Profit în primele 48h ≥ 8.000 EUR fără istoric verificat',
    window: 48,
    threshold: 8_000,
    action: 'hold',
  },
  {
    id: 'R12',
    name: 'Conturi multiple cu același device fingerprint / IP / IBAN',
    action: 'block',
  },
] as const;
