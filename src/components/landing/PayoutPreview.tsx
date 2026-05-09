'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calculator } from 'lucide-react';

/**
 * PayoutPreview — the only client component on the landing page.
 * Transparent formula:
 *   stakePerBet  = stake / betsPerMonth
 *   netUnitsPerBet = (winRate/100) * 0.95 - (1 - winRate/100)
 *   monthlyProfit = stakePerBet * netUnitsPerBet * betsPerMonth
 *   userPayout    = monthlyProfit * 0.80
 * Assumes average odds ~1.95 (0.95 net win per unit).
 */
export default function PayoutPreview() {
  const stakeId = useId();
  const wrId = useId();
  const bpmId = useId();

  const [stake, setStake] = useState(150);
  const [winRate, setWinRate] = useState(55);
  const [betsPerMonth, setBetsPerMonth] = useState(40);

  const { gross, payout, perBet } = useMemo(() => {
    const stakePerBet = stake / Math.max(1, betsPerMonth);
    const wr = winRate / 100;
    const netUnits = wr * 0.95 - (1 - wr);
    const grossProfit = stakePerBet * netUnits * betsPerMonth;
    return {
      gross: grossProfit,
      payout: grossProfit * 0.8,
      perBet: stakePerBet,
    };
  }, [stake, winRate, betsPerMonth]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 }).format(
      Math.round(n),
    );

  return (
    <section
      id="calculator"
      aria-labelledby="payout-title"
      className="border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
            Calculator rapid
          </p>
          <h2
            id="payout-title"
            className="font-bebas text-4xl leading-tight text-white sm:text-5xl"
          >
            Cât poți câștiga lunar
          </h2>
          <p className="mt-4 text-[color:var(--color-mist-400)]">
            Estimare orientativă — assumă cotă medie 1.95 și split standard de
            80%. Pentru calcule cu reguli reale per plan, vezi pagina cu
            calculatoare detaliate.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="landing-card p-6 sm:p-7 lg:col-span-3">
            <Field id={stakeId} label="Investiție pe lună (RON)" value={`${fmt(stake)} RON`}>
              <input
                id={stakeId}
                type="range"
                min={50}
                max={500}
                step={10}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="landing-range"
                aria-valuemin={50}
                aria-valuemax={500}
                aria-valuenow={stake}
              />
            </Field>

            <Field id={wrId} label="Rata de câștig (win-rate)" value={`${winRate}%`}>
              <input
                id={wrId}
                type="range"
                min={40}
                max={65}
                step={1}
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="landing-range"
                aria-valuemin={40}
                aria-valuemax={65}
                aria-valuenow={winRate}
              />
            </Field>

            <Field id={bpmId} label="Pariuri pe lună" value={`${betsPerMonth}`}>
              <input
                id={bpmId}
                type="range"
                min={10}
                max={100}
                step={1}
                value={betsPerMonth}
                onChange={(e) => setBetsPerMonth(Number(e.target.value))}
                className="landing-range"
                aria-valuemin={10}
                aria-valuemax={100}
                aria-valuenow={betsPerMonth}
              />
            </Field>

            <p className="mt-4 text-xs text-[color:var(--color-mist-500)]">
              Miză medie per pariu: {fmt(perBet)} RON.
            </p>
          </div>

          <div
            aria-live="polite"
            className="landing-card relative flex flex-col justify-between p-6 sm:p-7 lg:col-span-2"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
                <Calculator aria-hidden="true" className="h-3.5 w-3.5" />
                Estimare lunară
              </div>
              <p className="text-sm text-[color:var(--color-mist-400)]">
                Profit brut estimat
              </p>
              <p className="font-bebas text-4xl text-white sm:text-5xl">
                {fmt(gross)} RON
              </p>

              <div className="mt-6 rounded-xl border border-[color:var(--color-gold-400)]/30 bg-[color:var(--color-gold-400)]/5 p-4">
                <p className="text-xs uppercase tracking-wider text-[color:var(--color-mist-400)]">
                  Partea ta (80% split)
                </p>
                <p className="font-bebas text-3xl text-[color:var(--color-gold-400)]">
                  {fmt(payout)} RON / lună
                </p>
              </div>
            </div>

            <Link
              href="/calculatoare"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[color:var(--color-ink-600)] px-4 text-sm font-semibold text-[color:var(--color-mist-200)] transition-colors hover:border-[color:var(--color-gold-400)] hover:text-white"
            >
              Vezi calculatorul complet
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .landing-range {
          width: 100%;
          height: 28px;
          appearance: none;
          background: transparent;
          touch-action: none;
        }
        .landing-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: var(--color-ink-700);
        }
        .landing-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: var(--color-ink-700);
        }
        .landing-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 22px; width: 22px;
          margin-top: -8px;
          border-radius: 999px;
          background: var(--color-gold-400);
          border: 3px solid var(--color-ink-950);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,.6);
        }
        .landing-range::-moz-range-thumb {
          height: 22px; width: 22px;
          border-radius: 999px;
          background: var(--color-gold-400);
          border: 3px solid var(--color-ink-950);
          cursor: pointer;
        }
        .landing-range:focus-visible::-webkit-slider-thumb {
          outline: 2px solid var(--color-gold-400);
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  children,
}: {
  id: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[color:var(--color-mist-200)]">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-[color:var(--color-gold-400)]">
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}
