'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { decimalToImplied, fmtPct, fmtNum } from '@/lib/odds';

export default function HoldCalculator() {
  const [a, setA] = useState('1.91');
  const [b, setB] = useState('1.91');

  const out = useMemo(() => {
    const ip1 = decimalToImplied(parseFloat(a));
    const ip2 = decimalToImplied(parseFloat(b));
    const total = ip1 + ip2;
    const hold = total - 1;
    const fairA = ip1 / total;
    const fairB = ip2 / total;
    return { ip1, ip2, total, hold, fairA, fairB };
  }, [a, b]);

  return (
    <CalculatorShell
      title="Hold / Vig Calculator"
      description="Determină marja casei de pariuri (hold) și probabilitățile fair pe o piață cu 2 rezultate."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Cotă rezultat A (decimal)">
          <NumberInput value={a} step="0.01" min="1.01" onChange={e => setA(e.target.value)} />
        </Field>
        <Field label="Cotă rezultat B (decimal)">
          <NumberInput value={b} step="0.01" min="1.01" onChange={e => setB(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <ResultCard label="Total probabilități implicite" value={fmtPct(out.total)} />
        <ResultCard label="Hold (vig)" value={fmtPct(out.hold)} accent />
        <ResultCard label="Probabilitate fair A" value={fmtPct(out.fairA)} />
        <ResultCard label="Probabilitate fair B" value={fmtPct(out.fairB)} />
      </div>

      <p className="text-xs mt-5" style={{ color: 'var(--text-subtle)' }}>
        Hold tipic la cazierele majore: 4-6% pe pre-match, 6-10% pe live. Mai mic = piață mai favorabilă.
      </p>
    </CalculatorShell>
  );
}
