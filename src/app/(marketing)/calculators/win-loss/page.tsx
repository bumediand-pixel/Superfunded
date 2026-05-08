'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtPct } from '@/lib/odds';

export default function WinLossStreak() {
  const [winRate, setWinRate] = useState('55');
  const [streak, setStreak] = useState('5');

  const out = useMemo(() => {
    const p = (parseFloat(winRate) || 0) / 100;
    const n = Math.max(0, Math.floor(parseFloat(streak) || 0));
    return {
      winStreak: Math.pow(p, n),
      lossStreak: Math.pow(1 - p, n),
    };
  }, [winRate, streak]);

  return (
    <CalculatorShell
      title="Win / Loss Streak"
      description="Probabilitatea statistică a unei serii consecutive de N pick-uri câștigate sau pierdute."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Win Rate %">
          <NumberInput value={winRate} step="0.1" min="0" max="100" onChange={e => setWinRate(e.target.value)} />
        </Field>
        <Field label="Lungime serie (N pick-uri)">
          <NumberInput value={streak} step="1" min="1" max="50" onChange={e => setStreak(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="Probabilitate winning streak" value={fmtPct(out.winStreak, 4)} accent />
        <ResultCard label="Probabilitate losing streak" value={fmtPct(out.lossStreak, 4)} />
      </div>

      <p className="text-xs mt-5" style={{ color: 'var(--text-subtle)' }}>
        Folosește pentru stress-testing: chiar și un picker bun (60% WR) are ~10% șansă să prindă 5 loss-uri la rând. Bankroll management e cheia.
      </p>
    </CalculatorShell>
  );
}
