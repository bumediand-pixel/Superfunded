'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

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
    <section id="planuri" className="py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Planuri & Prețuri
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Alege challenge-ul tău
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Taxă unică · Fără abonament · Rambursată la prima retragere
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border)', background: 'white' }}>
            {(['1step', '2step'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer"
                style={mode === m
                  ? { background: 'var(--red)', color: 'white', boxShadow: '0 2px 8px rgba(230,57,70,0.3)' }
                  : { background: 'transparent', color: 'var(--text-muted)' }}>
                {m === '1step' ? '1-Step Challenge' : '2-Step Challenge'}
                {m === '2step' && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: mode === '2step' ? 'rgba(255,255,255,0.25)' : '#fff1f2', color: mode === '2step' ? 'white' : 'var(--red)' }}>
                  Recomandat
                </span>}
              </button>
            ))}
          </div>
        </div>

        {/* Features of mode */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map(f => (
            <div key={f} className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--border)', background: 'white', color: 'var(--text)' }}>
              <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--red)' }} />
              {f}
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planuri.map(plan => (
            <div key={plan.id}
              className="plan-card relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
              style={{
                background: 'white',
                border: plan.popular ? '2px solid var(--red)' : '1px solid var(--border)',
                boxShadow: plan.popular ? '0 8px 30px rgba(230,57,70,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
              }}>

              {plan.popular && (
                <div className="text-center py-2 text-xs font-bold tracking-widest text-white"
                  style={{ background: 'var(--red)' }}>
                  RECOMANDAT
                </div>
              )}

              <div className="p-6">
                <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{plan.tier}</div>
                <div className="text-4xl font-extrabold mb-0.5" style={{ color: plan.popular ? 'var(--red)' : 'var(--text)' }}>
                  {plan.capital}
                </div>
                <div className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>capital alocat</div>

                <div className="flex items-baseline gap-1.5 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-3xl font-extrabold" style={{ color: 'var(--text)' }}>{plan.taxa}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>taxă unică</span>
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg mb-5"
                  style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Split Profit</span>
                  <span className="text-xl font-extrabold" style={{ color: 'var(--red)' }}>{plan.split}</span>
                </div>

                <div className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-subtle)' }}>
                  {mode === '1step'
                    ? 'Target 40% · Limită 30 zile · Retrageri săptămânale'
                    : 'Target 30%+20% · Fără limită de timp · Retrageri săptămânale'}
                </div>

                <button onClick={() => handleCheckout(plan.id)} disabled={loading === plan.id}
                  className="w-full font-bold text-sm py-3.5 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                  style={plan.popular
                    ? { background: 'var(--red)', color: 'white' }
                    : { background: 'var(--bg-alt)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { const el = e.currentTarget; if (plan.popular) el.style.background = '#c0202d'; else el.style.background = 'var(--border)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; if (plan.popular) el.style.background = 'var(--red)'; else el.style.background = 'var(--bg-alt)'; }}>
                  {loading === plan.id ? 'Se procesează...' : 'Cumpără Acum'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-subtle)' }}>
          Taxă rambursată la prima retragere · Fără abonament · Retrageri în 24-48h
        </p>
      </div>
    </section>
  );
}
