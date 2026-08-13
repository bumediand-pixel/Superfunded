'use client';
import { useState } from 'react';
import { Zap, Trophy, Info, Bitcoin, CreditCard } from 'lucide-react';
import { priceFor, splitFor, type PlanId, type ChallengeMode } from '@/lib/stripe';
import { toast } from '@/components/Toaster';
import { BlurText } from '@/components/BlurText';

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
  { faza: 'Finantat', target: '—',   drawdown: '8%', daily: '5%', time: 'Nelimitat' },
];

const RULES_2STEP = [
  { faza: 'Faza 1',   target: '30%', drawdown: '8%', daily: '5%', time: '30 zile' },
  { faza: 'Faza 2',   target: '20%', drawdown: '8%', daily: '5%', time: '60 zile' },
  { faza: 'Finantat', target: '—',   drawdown: '8%', daily: '5%', time: 'Nelimitat' },
];

export default function PlanuriSection() {
  const [planId, setPlanId] = useState<PlanId>('STANDARD_5000');
  const capitalLabel = SIZES.find(s => s.id === planId)?.label ?? '';

  return (
    <section id="planuri" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        <div className="mb-12">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            Planuri & Preturi
          </span>
          <BlurText
            text="Alege-ti capitalul. Taxa unica."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[20ch]"
            delay={0.08}
          />
          <p className="mt-4 font-body text-sm text-[hsla(var(--cream)/0.55)] max-w-[48ch]">
            Selecteaza marimea contului. Compari 1-Step vs 2-Step si alegi varianta care ti se potriveste.
          </p>
        </div>

        {/* Size pill row */}
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 mb-10 flex justify-start md:justify-center">
          <div className="inline-flex liquid-glass rounded-full p-1.5 gap-1.5">
            {SIZES.map(s => {
              const on = s.id === planId;
              return (
                <button key={s.id} type="button" onClick={() => setPlanId(s.id)}
                  className="relative inline-flex items-center justify-center px-5 sm:px-6 h-10 rounded-full font-body text-sm font-bold cursor-pointer transition-all whitespace-nowrap"
                  style={on
                    ? { background: 'hsl(var(--red))', color: '#fff', boxShadow: '0 6px 18px rgba(230,57,70,0.32)' }
                    : { background: 'transparent', color: `hsla(var(--cream) / 0.65)` }
                  }>
                  {s.label}
                  {s.popular && !on && (
                    <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[hsl(var(--red))] text-white">
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

        <p className="text-center font-body text-xs mt-10 text-[hsla(var(--cream)/0.40)]">
          Toate planurile includ acces la dashboard, retrageri saptamanale si suport Discord.
          Plata unica, fara reinnoiri.
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
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) window.location.href = data.url;
      else if (res.status === 401) window.location.href = '/autentificare/login?redirect=/planuri';
      else toast.error(data.error || 'Nu am putut initia plata. Incearca din nou.');
    } catch { toast.error('Eroare de retea. Verifica conexiunea.'); }
  };

  const handleCryptoBuy = async () => {
    try {
      const res = await fetch('/api/crypto/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) window.location.href = data.url;
      else if (res.status === 401) window.location.href = '/autentificare/login?redirect=/planuri';
      else toast.error(data.error || 'Plata crypto nu e disponibila momentan.');
    } catch { toast.error('Eroare de retea. Verifica conexiunea.'); }
  };

  return (
    <div className={`liquid-glass rounded-2xl overflow-hidden transition-all ${recommended ? 'border-[hsl(var(--red))] border-2' : ''}`}>
      {recommended && (
        <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white text-center"
          style={{ background: 'hsl(var(--red))' }}>
          Cel mai popular
        </div>
      )}

      <div className="p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 liquid-glass rounded-full text-xs font-bold uppercase tracking-wider mb-4 text-[hsl(var(--cream))]">
          <Icon className="w-3.5 h-3.5 text-[hsl(var(--red))]" />
          {isOneStep ? '1 Pas' : '2 Pasi'}
        </span>

        <h3 className="font-display uppercase text-2xl sm:text-3xl mb-2 leading-tight text-[hsl(var(--cream))]">
          Challenge {isOneStep ? '1-Pas' : '2-Pasi'} · {capitalLabel}
        </h3>

        <p className="font-body text-sm leading-relaxed mb-6 text-[hsla(var(--cream)/0.60)]">
          {isOneStep
            ? 'Cel mai rapid drum catre finantare. Atinge target-ul de 40% intr-o singura faza, pastrezi 70% din profit.'
            : 'Doua faze realizabile, targeturi mai mici. Risc mai mic, split de profit mai mare — pastrezi 80% odata finantat.'}
        </p>

        {/* Phase tabs */}
        <div className="flex liquid-glass rounded-lg p-1 gap-1 mb-5">
          {phases.map(p => {
            const on = p === activePhase;
            return (
              <button key={p} type="button" onClick={() => setActivePhase(p)}
                className="flex-1 py-2 font-body text-xs font-bold rounded-md cursor-pointer transition-all"
                style={on
                  ? { background: 'hsla(var(--cream) / 0.12)', color: 'hsl(var(--cream))' }
                  : { background: 'transparent', color: 'hsla(var(--cream) / 0.50)' }
                }>
                {p}
              </button>
            );
          })}
        </div>

        <ul className="divide-y divide-[hsla(var(--cream)/0.08)] mb-6">
          <Row label="Tinta profit" value={phaseRule.target} />
          <Row label="Drawdown maxim" value={phaseRule.drawdown} />
          <Row label="Pierdere zilnica maxima" value={phaseRule.daily} />
          <Row label="Limita de timp" value={phaseRule.time} />
          <Row label="Split profit" value={`${split}%`} highlight />
        </ul>

        <div className="mb-5">
          <div className="font-display text-5xl leading-none text-[hsl(var(--cream))]">
            €{fee}
          </div>
          <div className="font-body text-xs font-semibold mt-1.5 text-[hsla(var(--cream)/0.50)]">
            Taxa unica · fara abonament
          </div>
        </div>

        <button type="button" onClick={handleBuy}
          className="w-full inline-flex items-center justify-center gap-2 font-body font-extrabold text-sm py-3.5 rounded-full cursor-pointer transition-all hover:-translate-y-0.5 bg-[hsl(var(--red))] text-white"
          style={{ boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
          <CreditCard className="w-4 h-4" />
          Plateste cu cardul
        </button>

        <button type="button" onClick={handleCryptoBuy}
          className="w-full inline-flex items-center justify-center gap-2 font-body font-bold text-xs py-2.5 mt-2 rounded-full cursor-pointer transition-all liquid-glass text-[hsl(var(--cream))]">
          <Bitcoin className="w-4 h-4 text-[#f7931a]" />
          Plateste cu crypto (USDT, BTC, ETH)
        </button>

        <div className="flex items-start gap-1.5 mt-3 font-body text-[11px] text-[hsla(var(--cream)/0.45)]">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>Dupa plata primesti instant acces in dashboard si poti incepe sa plasezi pick-uri.</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <li className="flex items-center justify-between py-3">
      <span className="font-body text-sm text-[hsla(var(--cream)/0.55)]">{label}</span>
      <span className={`font-body text-sm font-extrabold ${highlight ? 'text-[hsl(var(--red))]' : 'text-[hsl(var(--cream))]'}`}>
        {value}
      </span>
    </li>
  );
}
