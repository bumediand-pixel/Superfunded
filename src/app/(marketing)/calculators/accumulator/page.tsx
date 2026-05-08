'use client';
import { useState, useMemo } from 'react';
import CalculatorShell, { Field, NumberInput, ResultCard } from '@/components/calculators/CalculatorShell';
import { fmtMoney, fmtNum } from '@/lib/odds';
import { Plus, Trash2 } from 'lucide-react';

type Leg = { odds: string };

export default function AccumulatorCalculator() {
  const [legs, setLegs] = useState<Leg[]>([{ odds: '1.80' }, { odds: '2.10' }, { odds: '1.95' }]);
  const [stake, setStake] = useState('50');

  const out = useMemo(() => {
    const combined = legs.reduce((acc, l) => acc * (parseFloat(l.odds) || 1), 1);
    const s = parseFloat(stake) || 0;
    return { combined, payout: s * combined, profit: s * (combined - 1) };
  }, [legs, stake]);

  const updateLeg = (i: number, odds: string) => {
    const next = [...legs];
    next[i] = { odds };
    setLegs(next);
  };

  return (
    <CalculatorShell
      title="Accumulator (Acca)"
      description="Calculează cota combinată și payout-ul pentru un pariu cu N selecții."
    >
      <Field label="Stake total (€)">
        <NumberInput value={stake} step="1" min="0" onChange={e => setStake(e.target.value)} />
      </Field>

      <div className="space-y-3 mt-2">
        {legs.map((l, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text)' }}>Leg {i + 1} cotă</label>
              <NumberInput value={l.odds} step="0.01" min="1.01" onChange={e => updateLeg(i, e.target.value)} />
            </div>
            <button onClick={() => setLegs(legs.filter((_, j) => j !== i))}
              disabled={legs.length <= 2}
              className="p-3 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
              style={{ background: 'var(--bg-alt2)', border: '1px solid var(--border)' }}>
              <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => setLegs([...legs, { odds: '2.00' }])}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
        style={{ background: '#fff1f2', color: 'var(--red)', border: '1px solid #fecdd3' }}>
        <Plus className="w-4 h-4" />
        Adaugă leg
      </button>

      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <ResultCard label="Cotă combinată" value={fmtNum(out.combined, 2)} />
        <ResultCard label="Payout total" value={fmtMoney(out.payout)} />
        <ResultCard label="Profit net" value={fmtMoney(out.profit)} accent />
      </div>
    </CalculatorShell>
  );
}
