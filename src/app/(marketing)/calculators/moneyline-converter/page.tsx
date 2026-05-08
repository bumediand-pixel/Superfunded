'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import {
  americanToDecimal, decimalToAmerican, decimalToFractional,
  fractionalToDecimal, decimalToImplied, fmtNum, fmtPct,
} from '@/lib/odds';

type Mode = 'american' | 'decimal' | 'fractional';

export default function MoneylineConverter() {
  const [mode, setMode] = useState<Mode>('american');
  const [american, setAmerican] = useState('150');
  const [decimal, setDecimal] = useState('2.50');
  const [num, setNum] = useState('3');
  const [den, setDen] = useState('2');

  const dec = useMemo(() => {
    if (mode === 'american') return americanToDecimal(parseFloat(american));
    if (mode === 'decimal') return parseFloat(decimal);
    return fractionalToDecimal(parseFloat(num), parseFloat(den));
  }, [mode, american, decimal, num, den]);

  const am = decimalToAmerican(dec);
  const frac = decimalToFractional(dec);
  const implied = decimalToImplied(dec);

  return (
    <CalculatorShell
      title="Moneyline Converter"
      description="Convertește instant între formate American, Decimal și Fracțional + probabilitate implicită."
    >
      <Field label="Format de input">
        <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt2)' }}>
          {(['american', 'decimal', 'fractional'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
              style={mode === m
                ? { background: 'var(--red)', color: 'white' }
                : { background: 'transparent', color: 'var(--text-muted)' }}>
              {m === 'american' ? 'American' : m === 'decimal' ? 'Decimal' : 'Fracțional'}
            </button>
          ))}
        </div>
      </Field>

      {mode === 'american' && (
        <Field label="Cotă American (ex: +150 sau -200)">
          <NumberInput value={american} step="1" onChange={e => setAmerican(e.target.value)} />
        </Field>
      )}
      {mode === 'decimal' && (
        <Field label="Cotă decimal (ex: 2.50)">
          <NumberInput value={decimal} step="0.01" min="1.01" onChange={e => setDecimal(e.target.value)} />
        </Field>
      )}
      {mode === 'fractional' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Numerator (ex: 3)">
            <NumberInput value={num} step="1" min="1" onChange={e => setNum(e.target.value)} />
          </Field>
          <Field label="Denominator (ex: 2)">
            <NumberInput value={den} step="1" min="1" onChange={e => setDen(e.target.value)} />
          </Field>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="American" value={isFinite(am) ? (am > 0 ? `+${am}` : `${am}`) : '—'} />
        <ResultCard label="Decimal" value={fmtNum(dec, 3)} />
        <ResultCard label="Fracțional" value={frac} />
        <ResultCard label="Probabilitate implicită" value={fmtPct(implied)} accent />
      </div>
    </CalculatorShell>
  );
}
