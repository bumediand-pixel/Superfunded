// Pure odds-format utilities used by calculator pages.

export function americanToDecimal(american: number): number {
  if (!isFinite(american) || american === 0) return NaN;
  return american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american);
}

export function decimalToAmerican(decimal: number): number {
  if (!isFinite(decimal) || decimal <= 1) return NaN;
  return decimal >= 2 ? Math.round((decimal - 1) * 100) : -Math.round(100 / (decimal - 1));
}

export function decimalToFractional(decimal: number): string {
  if (!isFinite(decimal) || decimal <= 1) return '—';
  const num = decimal - 1;
  // Approximate to a denominator up to 100 using continued-fraction style search
  let bestN = 1, bestD = 1, bestErr = Infinity;
  for (let d = 1; d <= 100; d++) {
    const n = Math.round(num * d);
    const err = Math.abs(num - n / d);
    if (err < bestErr) { bestErr = err; bestN = n; bestD = d; if (err < 1e-9) break; }
  }
  const g = gcd(bestN, bestD);
  return `${bestN / g}/${bestD / g}`;
}

export function fractionalToDecimal(num: number, den: number): number {
  if (!isFinite(num) || !isFinite(den) || den === 0) return NaN;
  return 1 + num / den;
}

export function decimalToImplied(decimal: number): number {
  if (!isFinite(decimal) || decimal <= 1) return NaN;
  return 1 / decimal;
}

export function impliedToDecimal(implied: number): number {
  if (!isFinite(implied) || implied <= 0 || implied >= 1) return NaN;
  return 1 / implied;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function fmtPct(x: number, digits = 2): string {
  if (!isFinite(x)) return '—';
  return `${(x * 100).toFixed(digits)}%`;
}

export function fmtMoney(x: number, currency = '€'): string {
  if (!isFinite(x)) return '—';
  return `${currency}${x.toFixed(2)}`;
}

export function fmtNum(x: number, digits = 2): string {
  if (!isFinite(x)) return '—';
  return x.toFixed(digits);
}
