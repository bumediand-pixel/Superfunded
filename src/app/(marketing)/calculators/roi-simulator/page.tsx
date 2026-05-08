'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtMoney, fmtPct } from '@/lib/odds';

export default function ROISimulator() {
  const [bankroll, setBankroll] = useState('10000');
  const [picks, setPicks] = useState('60');
  const [winRate, setWinRate] = useState('55');
  const [avgOdds, setAvgOdds] = useState('1.95');
  const [stakePct, setStakePct] = useState('2');
  const [split, setSplit] = useState('80');

  const out = useMemo(() => {
    const br = parseFloat(bankroll) || 0;
    const n = parseFloat(picks) || 0;
    const wr = (parseFloat(winRate) || 0) / 100;
    const odds = parseFloat(avgOdds) || 0;
    const sp = (parseFloat(stakePct) || 0) / 100;
    const splitMult = (parseFloat(split) || 0) / 100;

    const stake = br * sp;
    const evPerPick = stake * (wr * (odds - 1) - (1 - wr));
    const monthlyGross = evPerPick * n;
    const monthlyNet = monthlyGross * splitMult;
    const yearlyNet = monthlyNet * 12;
    const roiMonthly = monthlyNet / br;
    return { stake, evPerPick, monthlyGross, monthlyNet, yearlyNet, roiMonthly };
  }, [bankroll, picks, winRate, avgOdds, stakePct, split]);

  return (
    <CalculatorShell
      title="ROI Simulator"
      description="Estimează venitul lunar din contul funded în funcție de win rate, frecvență și split."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Capital cont funded (€)">
          <NumberInput value={bankroll} step="100" min="0" onChange={e => setBankroll(e.target.value)} />
        </Field>
        <Field label="Picks pe lună">
          <NumberInput value={picks} step="1" min="0" onChange={e => setPicks(e.target.value)} />
        </Field>
        <Field label="Win Rate %" hint="Procent realist din picks-uri câștigate">
          <NumberInput value={winRate} step="0.1" min="0" max="100" onChange={e => setWinRate(e.target.value)} />
        </Field>
        <Field label="Cotă medie (decimal)">
          <NumberInput value={avgOdds} step="0.01" min="1.01" onChange={e => setAvgOdds(e.target.value)} />
        </Field>
        <Field label="Stake mediu % din bankroll">
          <NumberInput value={stakePct} step="0.1" min="0" max="100" onChange={e => setStakePct(e.target.value)} />
        </Field>
        <Field label="Profit Split %" hint="70% pentru 1-Step, 80% pentru 2-Step">
          <NumberInput value={split} step="1" min="0" max="100" onChange={e => setSplit(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="EV per pick (gross)" value={fmtMoney(out.evPerPick)} />
        <ResultCard label="ROI lunar" value={fmtPct(out.roiMonthly)} />
        <ResultCard label="Profit lunar net (după split)" value={fmtMoney(out.monthlyNet)} accent />
        <ResultCard label="Profit anual net" value={fmtMoney(out.yearlyNet)} accent />
      </div>
    </CalculatorShell>
  );
}
