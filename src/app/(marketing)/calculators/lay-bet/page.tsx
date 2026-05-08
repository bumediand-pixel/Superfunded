'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtMoney } from '@/lib/odds';

export default function LayBetCalculator() {
  const [backStake, setBackStake] = useState('100');
  const [backOdds, setBackOdds] = useState('2.20');
  const [layOdds, setLayOdds] = useState('2.30');
  const [exchangeCommission, setCommission] = useState('5');

  const out = useMemo(() => {
    const bs = parseFloat(backStake) || 0;
    const bo = parseFloat(backOdds) || 0;
    const lo = parseFloat(layOdds) || 0;
    const c = (parseFloat(exchangeCommission) || 0) / 100;

    // Lay stake to balance back+lay outcomes (approx)
    const layStake = (bs * bo) / (lo - c);
    const liability = layStake * (lo - 1);
    const profitIfBackWins = bs * (bo - 1) - liability;
    const profitIfLayWins = layStake * (1 - c) - bs;
    return { layStake, liability, profitIfBackWins, profitIfLayWins };
  }, [backStake, backOdds, layOdds, exchangeCommission]);

  return (
    <CalculatorShell
      title="Lay Bet Calculator"
      description="Stake pentru a echilibra un back-bet pe exchange. Ideal pentru matched betting și arbitraj."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Back stake (€)">
          <NumberInput value={backStake} step="1" min="0" onChange={e => setBackStake(e.target.value)} />
        </Field>
        <Field label="Back odds (decimal)">
          <NumberInput value={backOdds} step="0.01" min="1.01" onChange={e => setBackOdds(e.target.value)} />
        </Field>
        <Field label="Lay odds (exchange)">
          <NumberInput value={layOdds} step="0.01" min="1.01" onChange={e => setLayOdds(e.target.value)} />
        </Field>
        <Field label="Comision exchange %" hint="Tipic 2-5% pe Betfair / Smarkets">
          <NumberInput value={exchangeCommission} step="0.1" min="0" max="20" onChange={e => setCommission(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="Lay stake necesar" value={fmtMoney(out.layStake)} accent />
        <ResultCard label="Liability (rezervă)" value={fmtMoney(out.liability)} />
        <ResultCard label="Profit dacă câștigă back" value={fmtMoney(out.profitIfBackWins)} />
        <ResultCard label="Profit dacă câștigă lay" value={fmtMoney(out.profitIfLayWins)} />
      </div>
    </CalculatorShell>
  );
}
