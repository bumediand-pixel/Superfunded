'use client';
/**
 * /planuri — TFP-style: pill row pentru mărimea contului + comparație
 * 1-Step vs 2-Step side-by-side, în paleta noastră (light + roșu).
 *
 * Numerele de reguli mirror src/lib/stripe.ts rulesForMode().
 */
import { useState } from 'react';
import { Zap, Trophy, Info } from 'lucide-react';
import { PLANURI_STRIPE, priceFor, splitFor, type PlanId, type ChallengeMode } from '@/lib/stripe';

const SIZES: { id: PlanId; label: string; popular?: boolean }[] = [
  { id: 'STARTER_500',    label: '€500' },
  { id: 'BASIC_1000',     label: '€1k' },
  { id: 'STANDARD_5000',  label: '€5k' },
  { id: 'ADVANCED_10000', label: '€10k', popular: true },
  { id: 'PRO_25000',      label: '€25k' },
  { id: 'ELITE_50000',    label: '€50k' },
];

const RULES_1STEP = [
  { faza: 'Faza 1',   target: '40%', drawdown: '8%', daily: '5%', time: '30 zile' },
  { faza: 'Finanțat', target: '—',   drawdown: '8%', daily: '5%', time: 'Nelimitat' },
];

const RULES_2STEP = [
  { faza: 'Faza 1',   target: '30%', drawdown: '8%', daily: '5%', time: '30 zile' },
  { faza: 'Faza 2',   target: '20%', drawdown: '8%', daily: '5%', time: '60 zile' },
  { faza: 'Finanțat', target: '—',   drawdown: '8%', daily: '5%', time: 'Nelimitat' },
];

export default function PlanuriSection() {
  const [planId, setPlanId] = useState<PlanId>('STANDARD_5000');
  const capitalLabel = SIZES.find(s => s.id === planId)?.label ?? '';

  return (
    <section id="planuri" className="py-20 sm:py-24" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red, #e63946)', border: '1px solid #fecdd3' }}>
            Planuri
          </span>
          <h2 className="font-extrabold tracking-tight leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--text, #0f172a)' }}>
            Alege-ți capitalul. <span style={{ color: 'var(--red, #e63946)' }}>Taxă unică.</span>
          </h2>
          <p className="text-base sm:text-lg" style={{ color: 'var(--text-muted, #64748b)' }}>
            Selectează mărimea contului. Compari 1-Step vs 2-Step și alegi varianta care ți se potrivește.
          </p>
        </div>

        {/* Size pill row */}
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 mb-10 flex justify-center">
          <div className="inline-flex rounded-full p-1.5 shadow-sm gap-1.5"
            style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)' }}>
            {SIZES.map(s => {
              const on = s.id === planId;
              return (
                <button key={s.id} type="button" onClick={() => setPlanId(s.id)}
                  className="relative inline-flex items-center justify-center px-5 sm:px-6 h-11 rounded-full text-sm font-bold cursor-pointer transition-all whitespace-nowrap"
                  style={on
                    ? { background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 6px 18px rgba(230,57,70,0.32)' }
                    : { background: 'transparent', color: 'var(--text, #0f172a)' }
                  }>
                  {s.label}
                  {s.popular && !on && (
                    <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
                      style={{ background: 'var(--red, #e63946)', color: '#fff' }}>
                      Top
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <PlanCard mode="1step" planId={planId} capitalLabel={capitalLabel}
            price={priceFor(planId, '1step')} split={splitFor(planId, '1step')} rules={RULES_1STEP} />
          <PlanCard mode="2step" planId={planId} capitalLabel={capitalLabel}
            price={priceFor(planId, '2step')} split={splitFor(planId, '2step')} rules={RULES_2STEP} recommended />
        </div>

        <p className="text-center text-xs sm:text-sm mt-10" style={{ color: 'var(--text-muted, #64748b)' }}>
          Toate planurile includ acces la dashboard, retrageri săptămânale și suport Discord.
          Plata unică, fără reînnoiri.
        </p>
      </div>
    </section>
  );
}

type CardProps = {
  mode: ChallengeMode;
  planId: PlanId;
  capitalLabel: string;
  price: number;
  split: number;
  rules: typeof RULES_1STEP;
  recommended?: boolean;
};

function PlanCard({ mode, capitalLabel, price, split, rules, recommended, planId }: CardProps) {
  const phases = rules.map(r => r.faza);
  const [activePhase, setActivePhase] = useState(phases[0]);
  const phaseRule = rules.find(r => r.faza === activePhase) ?? rules[0];

  const isOneStep = mode === '1step';
  const Icon = isOneStep ? Zap : Trophy;
  const fee = (price / 100).toFixed(price % 100 === 0 ? 0 : 2);

  const handleBuy = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, mode }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Nu am putut iniția plata. Asigură-te că ești autentificat.');
    } catch { alert('Eroare de rețea.'); }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden transition-all"
      style={{
        background: '#ffffff',
        border: `${recommended ? '2px' : '1px'} solid ${recommended ? 'var(--red, #e63946)' : 'var(--border, #e2e8f0)'}`,
        boxShadow: recommended
          ? '0 20px 50px rgba(230,57,70,0.12), 0 4px 12px rgba(15,23,42,0.06)'
          : '0 4px 12px rgba(15,23,42,0.05)',
      }}>

      {recommended && (
        <div className="absolute top-0 right-0 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest"
          style={{ background: 'var(--red, #e63946)', color: '#fff', borderBottomLeftRadius: 12 }}>
          Cel mai popular
        </div>
      )}

      <div className="p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          style={{ background: '#fff1f2', color: 'var(--red, #e63946)', border: '1px solid #fecdd3' }}>
          <Icon className="w-3.5 h-3.5" />
          {isOneStep ? '1 Pas' : '2 Pași'}
        </span>

        <h3 className="font-extrabold text-2xl sm:text-3xl mb-2 leading-tight" style={{ color: 'var(--text, #0f172a)' }}>
          Challenge {isOneStep ? '1-Pas' : '2-Pași'} · {capitalLabel}
        </h3>

        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted, #64748b)' }}>
          {isOneStep
            ? 'Cel mai rapid drum către finanțare. Atinge target-ul de 40% într-o singură fază, păstrezi 70% din profit.'
            : 'Două faze realizabile, targeturi mai mici. Risc mai mic, split de profit mai mare — păstrezi 80% odată finanțat.'}
        </p>

        <div className="flex rounded-lg p-1 gap-1 mb-5"
          style={{ background: 'var(--bg-alt, #fbf8f6)', border: '1px solid var(--border, #e2e8f0)' }}>
          {phases.map(p => {
            const on = p === activePhase;
            return (
              <button key={p} type="button" onClick={() => setActivePhase(p)}
                className="flex-1 py-2 text-xs font-bold rounded-md cursor-pointer transition-all"
                style={on
                  ? { background: '#ffffff', color: 'var(--text, #0f172a)', boxShadow: '0 1px 3px rgba(15,23,42,0.08)' }
                  : { background: 'transparent', color: 'var(--text-muted, #64748b)' }
                }>
                {p}
              </button>
            );
          })}
        </div>

        <ul className="divide-y mb-6" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
          <Row label="Țintă profit" value={phaseRule.target} />
          <Row label="Drawdown maxim" value={phaseRule.drawdown} />
          <Row label="Pierdere zilnică maximă" value={phaseRule.daily} />
          <Row label="Limită de timp" value={phaseRule.time} />
          <Row label="Split profit" value={`${split}%`} highlight />
        </ul>

        <div className="mb-5">
          <div className="font-extrabold leading-none" style={{ fontSize: 'clamp(36px, 5vw, 48px)', color: 'var(--text, #0f172a)' }}>
            €{fee}
          </div>
          <div className="text-xs font-semibold mt-1.5" style={{ color: 'var(--text-muted, #64748b)' }}>
            Taxă unică · fără abonament
          </div>
        </div>

        <button type="button" onClick={handleBuy}
          className="w-full font-extrabold text-sm py-3.5 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--red, #e63946)', color: '#fff', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
          Cumpără acum →
        </button>

        <div className="flex items-start gap-1.5 mt-3 text-[11px]" style={{ color: 'var(--text-muted, #64748b)' }}>
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>După plată primești instant acces în dashboard și poți începe să plasezi pick-uri.</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <li className="flex items-center justify-between py-3">
      <span className="text-sm" style={{ color: 'var(--text-muted, #64748b)' }}>{label}</span>
      <span className="text-sm font-extrabold" style={{ color: highlight ? 'var(--red, #e63946)' : 'var(--text, #0f172a)' }}>
        {value}
      </span>
    </li>
  );
}
