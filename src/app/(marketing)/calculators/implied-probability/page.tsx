'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { americanToDecimal, decimalToImplied, fmtPct, fmtNum } from '@/lib/odds';

type Format = 'decimal' | 'american' | 'fractional';

export default function ImpliedProbability() {
  const [format, setFormat] = useState<Format>('decimal');
  const [val, setVal] = useState('2.00');
  const [num, setNum] = useState('1');
  const [den, setDen] = useState('1');

  const decimal = useMemo(() => {
    if (format === 'decimal') return parseFloat(val) || NaN;
    if (format === 'american') return americanToDecimal(parseFloat(val));
    const n = parseFloat(num); const d = parseFloat(den);
    return d === 0 ? NaN : 1 + n / d;
  }, [format, val, num, den]);

  const implied = decimalToImplied(decimal);
  const fairOdds = isFinite(implied) ? 1 / (implied) : NaN;

  return (
    <CalculatorShell
      title="Implied Probability"
      description="Convertește o cotă în probabilitatea implicită — punctul de plecare pentru orice value bet."
    >
      <Field label="Format cotă">
        <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt2)' }}>
          {(['decimal', 'american', 'fractional'] as Format[]).map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
              style={format === f
                ? { background: 'var(--red)', color: 'white' }
                : { background: 'transparent', color: 'var(--text-muted)' }}>
              {f === 'decimal' ? 'Decimal' : f === 'american' ? 'American' : 'Fracțional'}
            </button>
          ))}
        </div>
      </Field>

      {format !== 'fractional' ? (
        <Field label={format === 'decimal' ? 'Cotă decimal (ex: 2.00)' : 'Cotă American (ex: +150 sau -200)'}>
          <NumberInput value={val} step={format === 'decimal' ? '0.01' : '1'} onChange={e => setVal(e.target.value)} />
        </Field>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Numerator (ex: 5)">
            <NumberInput value={num} step="1" min="1" onChange={e => setNum(e.target.value)} />
          </Field>
          <Field label="Denominator (ex: 2)">
            <NumberInput value={den} step="1" min="1" onChange={e => setDen(e.target.value)} />
          </Field>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <ResultCard label="Cotă decimal" value={fmtNum(decimal, 3)} />
        <ResultCard label="Probabilitate implicită" value={fmtPct(implied)} accent />
        <ResultCard label="Cotă fair (zero vig)" value={fmtNum(fairOdds, 3)} />
      </div>
    </CalculatorShell>
  );
}
