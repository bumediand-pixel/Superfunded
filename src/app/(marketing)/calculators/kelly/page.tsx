'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtPct, fmtMoney } from '@/lib/odds';

export default function KellyCalculator() {
  const [decimalOdds, setDecimalOdds] = useState('2.00');
  const [winProb, setWinProb] = useState('55');
  const [bankroll, setBankroll] = useState('1000');
  const [fraction, setFraction] = useState('1');

  const out = useMemo(() => {
    const b = parseFloat(decimalOdds) - 1;
    const p = parseFloat(winProb) / 100;
    const q = 1 - p;
    const f = (b * p - q) / b;
    const adjusted = f * (parseFloat(fraction) || 1);
    const stake = (parseFloat(bankroll) || 0) * Math.max(0, adjusted);
    return { kelly: f, adjusted, stake };
  }, [decimalOdds, winProb, bankroll, fraction]);

  return (
    <CalculatorShell
      title="Kelly Criterion"
      description="Calculează procentul optim din bankroll pentru fiecare pick, ținând cont de edge-ul tău real."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Cotă (decimal)" hint="Ex: 2.00 înseamnă +100 American">
          <NumberInput value={decimalOdds} step="0.01" min="1.01" onChange={e => setDecimalOdds(e.target.value)} />
        </Field>
        <Field label="Probabilitate de câștig %" hint="Estimarea ta despre cât de probabil e să câștigi">
          <NumberInput value={winProb} step="0.1" min="0" max="100" onChange={e => setWinProb(e.target.value)} />
        </Field>
        <Field label="Bankroll (€)">
          <NumberInput value={bankroll} step="10" min="0" onChange={e => setBankroll(e.target.value)} />
        </Field>
        <Field label="Fracție Kelly" hint="1 = full Kelly, 0.5 = half-Kelly (recomandat)">
          <NumberInput value={fraction} step="0.05" min="0" max="1" onChange={e => setFraction(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <ResultCard label="Full Kelly" value={fmtPct(out.kelly)} />
        <ResultCard label="Kelly aplicat" value={fmtPct(out.adjusted)} />
        <ResultCard label="Stake recomandat" value={fmtMoney(out.stake)} accent />
      </div>

      <p className="text-xs mt-5" style={{ color: 'var(--text-subtle)' }}>
        ⚠️ Kelly negativ înseamnă că NU există edge — nu pune pickul respectiv.
      </p>
    </CalculatorShell>
  );
}
