'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const PLANURI_1STEP = [
  { id: 'STARTER_500',    capital: '€500',    taxa: '€29',  split: '70%', popular: false, tier: 'Starter' },
  { id: 'BASIC_1000',     capital: '€1.000',  taxa: '€49',  split: '70%', popular: false, tier: 'Basic' },
  { id: 'STANDARD_5000',  capital: '€5.000',  taxa: '€99',  split: '70%', popular: false, tier: 'Standard' },
  { id: 'ADVANCED_10000', capital: '€10.000', taxa: '€179', split: '70%', popular: true,  tier: 'Advanced' },
  { id: 'PRO_25000',      capital: '€25.000', taxa: '€349', split: '70%', popular: false, tier: 'Pro' },
  { id: 'ELITE_50000',    capital: '€50.000', taxa: '€599', split: '70%', popular: false, tier: 'Elite' },
];

const PLANURI_2STEP = [
  { id: 'STARTER_500',    capital: '€500',    taxa: '€19',  split: '80%', popular: false, tier: 'Starter' },
  { id: 'BASIC_1000',     capital: '€1.000',  taxa: '€35',  split: '80%', popular: false, tier: 'Basic' },
  { id: 'STANDARD_5000',  capital: '€5.000',  taxa: '€74',  split: '80%', popular: false, tier: 'Standard' },
  { id: 'ADVANCED_10000', capital: '€10.000', taxa: '€139', split: '80%', popular: true,  tier: 'Advanced' },
  { id: 'PRO_25000',      capital: '€25.000', taxa: '€269', split: '80%', popular: false, tier: 'Pro' },
  { id: 'ELITE_50000',    capital: '€50.000', taxa: '€449', split: '80%', popular: false, tier: 'Elite' },
];

const FEATURES_1 = ['Target profit 40%', 'Limită 30 zile', 'Split 70%', 'Max drawdown 8%', 'Retrageri săptămânale'];
const FEATURES_2 = ['Target 30% + 20%', 'Fără limită de timp', 'Split 80%', 'Max drawdown 8%', 'Retrageri săptămânale', 'Taxă rambursată'];

export default function PlanuriSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'1step' | '2step'>('2step');

  const planuri = mode === '1step' ? PLANURI_1STEP : PLANURI_2STEP;
  const features = mode === '1step' ? FEATURES_1 : FEATURES_2;

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: planId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error === 'Neautentificat') router.push('/autentificare/login');
    } finally { setLoading(null); }
  };

  return (
    <section id="planuri" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block mb-4">
            Planuri & Prețuri
          </span>
          <BlurText
            text="Alege challenge-ul tău."
            as="h2"
            className="font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[20ch] mx-auto"
            delay={0.08}
          />
          <p className="mt-4 font-body text-base text-[hsla(var(--cream)/0.60)]">
            Taxă unică · Fără abonament · Rambursată la prima retragere
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="liquid-glass rounded-full p-1 inline-flex">
            {(['1step', '2step'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))]"
                style={mode === m
                  ? { background: 'hsl(var(--red))', color: 'white' }
                  : { background: 'transparent', color: 'hsla(var(--cream)/0.60)' }
                }
              >
                {m === '1step' ? '1-Step Challenge' : '2-Step Challenge'}
                {m === '2step' && (
                  <span
                    className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{
                      background: mode === '2step' ? 'rgba(255,255,255,0.20)' : 'hsla(var(--red)/0.15)',
                      color: mode === '2step' ? 'white' : 'hsl(var(--red))',
                    }}
                  >
                    Recomandat
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map(f => (
            <div
              key={f}
              className="liquid-glass flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full text-[hsla(var(--cream)/0.80)]"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[hsl(var(--red))]" />
              {f}
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planuri.map(plan => (
            <div
              key={plan.id}
              className="plan-card liquid-glass relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{
                border: plan.popular ? '1.5px solid hsl(var(--red)/0.60)' : undefined,
                boxShadow: plan.popular ? '0 0 40px hsl(var(--red)/0.08)' : undefined,
              }}
            >
              {plan.popular && (
                <div
                  className="text-center py-2 text-xs font-bold tracking-widest text-white"
                  style={{ background: 'hsl(var(--red))' }}
                >
                  RECOMANDAT
                </div>
              )}

              <div className="p-6">
                <div className="text-sm font-semibold mb-1 text-[hsla(var(--cream)/0.55)]">{plan.tier}</div>
                <div
                  className="text-4xl font-display leading-none mb-0.5"
                  style={{ color: plan.popular ? 'hsl(var(--red))' : 'hsl(var(--cream))' }}
                >
                  {plan.capital}
                </div>
                <div className="text-xs mb-5 text-[hsla(var(--cream)/0.40)]">capital alocat</div>

                <div className="flex items-baseline gap-1.5 mb-5 pb-5 border-b border-[hsla(var(--cream)/0.10)]">
                  <span className="text-3xl font-display text-[hsl(var(--cream))]">{plan.taxa}</span>
                  <span className="text-sm text-[hsla(var(--cream)/0.55)]">taxă unică</span>
                </div>

                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-5"
                  style={{ background: 'hsla(var(--red)/0.12)', border: '1px solid hsla(var(--red)/0.25)' }}
                >
                  <span className="text-xs font-semibold text-[hsla(var(--cream)/0.60)]">Split Profit</span>
                  <span className="text-xl font-display text-[hsl(var(--red))]">{plan.split}</span>
                </div>

                <div className="text-xs mb-6 leading-relaxed text-[hsla(var(--cream)/0.45)]">
                  {mode === '1step'
                    ? 'Target 40% · Limită 30 zile · Retrageri săptămânale'
                    : 'Target 30%+20% · Fără limită de timp · Retrageri săptămânale'}
                </div>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full font-semibold text-sm py-3.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))]"
                  style={plan.popular
                    ? { background: 'hsl(var(--red))', color: 'white' }
                    : { background: 'hsla(var(--cream)/0.08)', color: 'hsl(var(--cream))', border: '1px solid hsla(var(--cream)/0.15)' }
                  }
                >
                  {loading === plan.id ? 'Se procesează...' : 'Cumpără Acum'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6 text-[hsla(var(--cream)/0.40)]">
          Taxă rambursată la prima retragere · Fără abonament · Retrageri în 24-48h
        </p>
      </div>
    </section>
  );
}
