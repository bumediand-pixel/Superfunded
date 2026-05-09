'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';

// Transparent formula: assumes a +1.95 average odd (typical RO sportsbook line)
// and a 1u stake equal to the bankroll fraction set by the user. Output is a
// monthly net profit estimate AFTER the 80% profit split.
//
//   bets       = bets/month
//   stake      = investiție RO -> bankroll fraction; we treat stake as the
//                full investment per bet (deliberately conservative).
//   winRate    = % wins
//   averageOdd = 1.95
//   profit     = bets * stake * (winRate * (averageOdd - 1) - (1 - winRate))
//   takeHome   = profit * 0.80
const AVG_ODD = 1.95;
const PROFIT_SPLIT = 0.8;
const RON = (n: number) =>
  new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 })
    .format(n);

export default function PayoutPreview() {
  const [stake, setStake] = useState(150);
  const [winRate, setWinRate] = useState(55);
  const [bets, setBets] = useState(40);

  const stakeId = useId();
  const wrId = useId();
  const betsId = useId();

  const { profit, takeHome } = useMemo(() => {
    const wr = winRate / 100;
    const ev = wr * (AVG_ODD - 1) - (1 - wr);
    const grossProfit = bets * stake * ev;
    return {
      profit: Math.max(0, grossProfit),
      takeHome: Math.max(0, grossProfit * PROFIT_SPLIT),
    };
  }, [stake, winRate, bets]);

  return (
    <section
      id="calculator"
      aria-labelledby="payout-title"
      className="relative border-b border-[color:var(--color-ink-800)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-gold-400)]">
              Estimator
            </p>
            <h2
              id="payout-title"
              className="mt-3 font-bebas text-4xl tracking-tight text-white sm:text-5xl"
            >
              Cât poți câștiga lunar
            </h2>
            <p className="mt-4 max-w-md text-base text-[color:var(--color-mist-400)]">
              Mișcă slider-ele pentru a vedea o estimare transparentă. Calculul folosește o cotă
              medie de {AVG_ODD.toFixed(2)} și aplică split-ul de 80%.
            </p>

            <div className="mt-10 space-y-7">
              <Slider
                id={stakeId}
                label="Investiție per pariu"
                suffix="RON"
                min={50}
                max={500}
                step={10}
                value={stake}
                onChange={setStake}
              />
              <Slider
                id={wrId}
                label="Win rate estimat"
                suffix="%"
                min={40}
                max={65}
                step={1}
                value={winRate}
                onChange={setWinRate}
              />
              <Slider
                id={betsId}
                label="Pariuri pe lună"
                suffix=""
                min={10}
                max={100}
                step={1}
                value={bets}
                onChange={setBets}
              />
            </div>
          </div>

          <div
            aria-live="polite"
            className="rounded-2xl border border-[color:var(--color-ink-700)] bg-gradient-to-b from-[color:var(--color-ink-900)] to-[color:var(--color-ink-950)] p-8 shadow-xl shadow-black/40"
          >
            <p className="text-xs uppercase tracking-widest text-[color:var(--color-mist-500)]">
              Estimare lunară (după split 80%)
            </p>
            <p className="mt-3 font-bebas text-5xl text-[color:var(--color-volt-400)] sm:text-6xl">
              {RON(takeHome)}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/60 p-4">
                <dt className="text-[color:var(--color-mist-500)]">Profit brut</dt>
                <dd className="mt-1 font-mono text-lg text-[color:var(--color-mist-200)]">
                  {RON(profit)}
                </dd>
              </div>
              <div className="rounded-lg border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/60 p-4">
                <dt className="text-[color:var(--color-mist-500)]">Cota folosită</dt>
                <dd className="mt-1 font-mono text-lg text-[color:var(--color-mist-200)]">
                  {AVG_ODD.toFixed(2)}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-xs text-[color:var(--color-mist-500)]">
              Estimarea este orientativă. Rezultatele reale depind de selecții, money management și
              disciplină. Pariază responsabil.
            </p>

            <Link
              href="/calculators"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-gold-400)] hover:underline"
              style={{ minHeight: 48 }}
            >
              Deschide calculatoarele complete
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SliderProps {
  id: string;
  label: string;
  suffix: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

function Slider({ id, label, suffix, min, max, step, value, onChange }: SliderProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[color:var(--color-mist-200)]">
          {label}
        </label>
        <span className="font-mono text-sm text-[color:var(--color-gold-400)]">
          {value}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--color-ink-700)] accent-[color:var(--color-gold-400)]"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="mt-1 flex justify-between text-[10px] text-[color:var(--color-mist-500)]">
        <span>
          {min}
          {suffix ? ` ${suffix}` : ''}
        </span>
        <span>
          {max}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
    </div>
  );
}
