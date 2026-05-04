'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const PLANURI_1STEP = [
  { id: 'STARTER_500',    capital: '€500',    taxa: '€29',  split: '70%', popular: false, tier: 'STARTER' },
  { id: 'BASIC_1000',     capital: '€1.000',  taxa: '€49',  split: '70%', popular: false, tier: 'BASIC' },
  { id: 'STANDARD_5000',  capital: '€5.000',  taxa: '€99',  split: '70%', popular: false, tier: 'STANDARD' },
  { id: 'ADVANCED_10000', capital: '€10.000', taxa: '€179', split: '70%', popular: true,  tier: 'ADVANCED' },
  { id: 'PRO_25000',      capital: '€25.000', taxa: '€349', split: '70%', popular: false, tier: 'PRO' },
  { id: 'ELITE_50000',    capital: '€50.000', taxa: '€599', split: '70%', popular: false, tier: 'ELITE' },
];

const PLANURI_2STEP = [
  { id: 'STARTER_500',    capital: '€500',    taxa: '€19',  split: '80%', popular: false, tier: 'STARTER' },
  { id: 'BASIC_1000',     capital: '€1.000',  taxa: '€35',  split: '80%', popular: false, tier: 'BASIC' },
  { id: 'STANDARD_5000',  capital: '€5.000',  taxa: '€74',  split: '80%', popular: false, tier: 'STANDARD' },
  { id: 'ADVANCED_10000', capital: '€10.000', taxa: '€139', split: '80%', popular: true,  tier: 'ADVANCED' },
  { id: 'PRO_25000',      capital: '€25.000', taxa: '€269', split: '80%', popular: false, tier: 'PRO' },
  { id: 'ELITE_50000',    capital: '€50.000', taxa: '€449', split: '80%', popular: false, tier: 'ELITE' },
];

const REGULI_1STEP = [
  { label: 'Target Profit',   val: '40%',  gold: true },
  { label: 'Faze',            val: '1',    gold: false },
  { label: 'Split Profit',    val: '70%',  gold: true },
  { label: 'Max Drawdown',    val: '8%',   gold: false },
  { label: 'Limită Zilnică',  val: '5%',   gold: false },
  { label: 'Limită de Timp',  val: '30 zile', gold: false },
];

const REGULI_2STEP = [
  { label: 'Target Faza 1',   val: '30%',  gold: true },
  { label: 'Target Faza 2',   val: '20%',  gold: true },
  { label: 'Split Profit',    val: '80%',  gold: true },
  { label: 'Max Drawdown',    val: '8%',   gold: false },
  { label: 'Limită Zilnică',  val: '5%',   gold: false },
  { label: 'Limită de Timp',  val: '∞',    gold: false },
];

export default function PlanuriSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'1step' | '2step'>('2step');
  const ref = useRef<HTMLElement>(null);

  const planuri = mode === '1step' ? PLANURI_1STEP : PLANURI_2STEP;
  const reguli  = mode === '1step' ? REGULI_1STEP  : REGULI_2STEP;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.plan-card', { opacity: 0, y: 40, scale: 0.96 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.plans-grid', start: 'top 78%', toggleActions: 'play none none reverse' },
      });
    }, ref);
    return () => ctx.revert();
  }, [mode]);

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
    <section id="planuri" ref={ref} className="relative py-32 overflow-hidden" style={{ background: 'var(--black-1)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(230,57,70,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ background: 'var(--red)' }} />
                <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Planuri & Prețuri</span>
              </div>
              <h2 className="font-bebas leading-none" style={{ fontSize: 'clamp(52px, 9vw, 110px)', letterSpacing: '0.03em' }}>
                ALEGE<br/>CHALLENGE-UL TĂU
              </h2>
            </div>

            {/* 1-Step / 2-Step toggle */}
            <div className="flex items-center gap-0 border self-start lg:self-end" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <button onClick={() => setMode('1step')}
                className="relative font-mono text-xs tracking-[0.16em] uppercase px-6 py-3 transition-all duration-300"
                style={{ background: mode === '1step' ? 'var(--red)' : 'transparent', color: mode === '1step' ? 'white' : 'var(--white-mid)' }}>
                1-Step
                {mode === '1step' && <span className="ml-2 font-mono text-[9px] opacity-70">40% target</span>}
              </button>
              <button onClick={() => setMode('2step')}
                className="relative font-mono text-xs tracking-[0.16em] uppercase px-6 py-3 transition-all duration-300"
                style={{ background: mode === '2step' ? 'var(--red)' : 'transparent', color: mode === '2step' ? 'white' : 'var(--white-mid)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                2-Step
                {mode === '2step' && <span className="ml-2 font-mono text-[9px] opacity-70">30%+20%</span>}
              </button>
            </div>
          </div>

          {/* Mode description */}
          <div className="mt-6 flex gap-8 flex-wrap">
            {mode === '1step' ? (
              <div className="flex items-start gap-3 max-w-lg">
                <span style={{ color: 'var(--red)', marginTop: '2px' }}>◆</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>
                  <strong style={{ color: 'var(--white-hi)' }}>1-Step Challenge:</strong> Un singur target de <strong style={{ color: 'var(--gold)' }}>40% profit</strong> fără limită zilnică strictă. Mai rapid, dar condiții mai solicitante. Split de <strong style={{ color: 'var(--gold)' }}>70%</strong> odată finanțat.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 max-w-lg">
                <span style={{ color: 'var(--red)', marginTop: '2px' }}>◆</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>
                  <strong style={{ color: 'var(--white-hi)' }}>2-Step Challenge:</strong> Două faze consecutive (<strong style={{ color: 'var(--gold)' }}>30%</strong> + <strong style={{ color: 'var(--gold)' }}>20%</strong>). Fără limită de timp, taxă mai mică și split de <strong style={{ color: 'var(--gold)' }}>80%</strong>. Recomandat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rules summary bar */}
        <div className="mb-8 grid grid-cols-3 md:grid-cols-6 border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--black-2)' }}>
          {reguli.map((r, i) => (
            <div key={i} className="px-4 py-3 flex flex-col gap-0.5" style={{ borderRight: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>{r.label}</span>
              <span className="font-mono text-base font-bold" style={{ color: r.gold ? 'var(--gold)' : 'var(--white-hi)' }}>{r.val}</span>
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div className="plans-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planuri.map(plan => (
            <div key={plan.id}
              className="plan-card relative overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: plan.popular ? 'linear-gradient(145deg, rgba(230,57,70,0.1) 0%, var(--black-2) 100%)' : 'var(--black-2)',
                border: plan.popular ? '1px solid rgba(230,57,70,0.4)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: plan.popular ? '0 0 40px rgba(230,57,70,0.1)' : 'none',
              }}>
              {plan.popular && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, var(--red), transparent)' }} />}

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: plan.popular ? 'var(--red)' : 'rgba(255,255,255,0.25)' }}>{plan.tier}</span>
                  {plan.popular && <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ background: 'var(--red)', color: 'white' }}>POPULAR</span>}
                </div>

                <div className="font-bebas leading-none mb-1" style={{ fontSize: '44px', letterSpacing: '0.02em', color: 'var(--white-hi)' }}>{plan.capital}</div>
                <div className="font-mono text-xs mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>capital alocat</div>

                <div className="flex items-baseline gap-2 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="font-bebas" style={{ fontSize: '50px', color: plan.popular ? 'var(--red)' : 'var(--white-hi)', letterSpacing: '0.02em' }}>{plan.taxa}</span>
                  <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>taxă unică</span>
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 mb-5"
                  style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.6)' }}>Split Profit</span>
                  <span className="font-bebas text-2xl" style={{ color: 'var(--gold)', letterSpacing: '0.05em' }}>{plan.split}</span>
                </div>

                <div className="mb-5 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {mode === '1step'
                    ? 'Target 40% · Limită 30 zile · Retrageri săptămânale'
                    : 'Target 30%+20% · Fără limită de timp · Retrageri săptămânale'
                  }
                </div>

                <button onClick={() => handleCheckout(plan.id)} disabled={loading === plan.id}
                  className="w-full font-bold text-xs tracking-[0.14em] uppercase py-3.5 transition-all duration-300 disabled:opacity-40"
                  style={plan.popular ? {
                    background: 'var(--red)', color: 'white',
                    clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                  } : {
                    background: 'transparent', color: 'var(--white-mid)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={e => { if (!plan.popular) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'white'; } }}
                  onMouseLeave={e => { if (!plan.popular) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--white-mid)'; } }}>
                  {loading === plan.id ? '⟳ Se procesează...' : 'Cumpără Acum'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Taxă rambursată la prima retragere · Fără abonament · Retrageri în 24-48h
        </p>
      </div>
    </section>
  );
}
