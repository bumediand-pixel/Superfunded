'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtMoney, fmtNum } from '@/lib/odds';

export default function MiddleBetCalculator() {
  const [oddsA, setOddsA] = useState('2.00');
  const [oddsB, setOddsB] = useState('2.10');
  const [stakeA, setStakeA] = useState('100');
  const [stakeB, setStakeB] = useState('100');

  const out = useMemo(() => {
    const a = parseFloat(oddsA) || 0;
    const b = parseFloat(oddsB) || 0;
    const sa = parseFloat(stakeA) || 0;
    const sb = parseFloat(stakeB) || 0;

    const totalStake = sa + sb;
    const winA = sa * a - totalStake;        // dacă A câștigă
    const winB = sb * b - totalStake;        // dacă B câștigă
    const winBoth = sa * a + sb * b - totalStake; // middle hits — ambele plătesc
    const lossOnly = -totalStake;            // niciuna nu plătește (rar)
    return { winA, winB, winBoth, lossOnly };
  }, [oddsA, oddsB, stakeA, stakeB]);

  return (
    <CalculatorShell
      title="Middle Bet Calculator"
      description="Pariezi pe ambele părți cu linii diferite — dacă scorul cade între linii, câștigi de două ori."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Cotă A (decimal)">
          <NumberInput value={oddsA} step="0.01" min="1.01" onChange={e => setOddsA(e.target.value)} />
        </Field>
        <Field label="Cotă B (decimal)">
          <NumberInput value={oddsB} step="0.01" min="1.01" onChange={e => setOddsB(e.target.value)} />
        </Field>
        <Field label="Stake A (€)">
          <NumberInput value={stakeA} step="1" min="0" onChange={e => setStakeA(e.target.value)} />
        </Field>
        <Field label="Stake B (€)">
          <NumberInput value={stakeB} step="1" min="0" onChange={e => setStakeB(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="Profit dacă doar A câștigă" value={fmtMoney(out.winA)} />
        <ResultCard label="Profit dacă doar B câștigă" value={fmtMoney(out.winB)} />
        <ResultCard label="Profit dacă AMBELE câștigă (middle 🎯)" value={fmtMoney(out.winBoth)} accent />
        <ResultCard label="Pierdere dacă niciuna" value={fmtMoney(out.lossOnly)} />
      </div>
    </CalculatorShell>
  );
}
