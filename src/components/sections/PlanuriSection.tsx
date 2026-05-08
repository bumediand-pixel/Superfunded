'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Clock, RefreshCw, Wallet, Trophy } from 'lucide-react';
import CheckoutDisclaimer from '@/components/CheckoutDisclaimer';

type PlanId =
  | 'STARTER_500'
  | 'BASIC_1000'
  | 'STANDARD_5000'
  | 'ADVANCED_10000'
  | 'PRO_25000'
  | 'ELITE_50000';

type Plan = {
  id: PlanId;
  size: string;
  sizeShort: string;
  capital: string;
  taxa1: string;
  taxa2: string;
  split1: string;
  split2: string;
  popular: boolean;
};

const PLANS: Plan[] = [
  { id: 'STARTER_500',    size: '€500',    sizeShort: '€500',  capital: '€500',    taxa1: '€29',  taxa2: '€19',  split1: '70%', split2: '80%', popular: false },
  { id: 'BASIC_1000',     size: '€1.000',  sizeShort: '€1K',   capital: '€1.000',  taxa1: '€49',  taxa2: '€35',  split1: '70%', split2: '80%', popular: false },
  { id: 'STANDARD_5000',  size: '€5.000',  sizeShort: '€5K',   capital: '€5.000',  taxa1: '€99',  taxa2: '€74',  split1: '70%', split2: '80%', popular: false },
  { id: 'ADVANCED_10000', size: '€10.000', sizeShort: '€10K',  capital: '€10.000', taxa1: '€179', taxa2: '€139', split1: '75%', split2: '80%', popular: true  },
  { id: 'PRO_25000',      size: '€25.000', sizeShort: '€25K',  capital: '€25.000', taxa1: '€349', taxa2: '€269', split1: '75%', split2: '80%', popular: false },
  { id: 'ELITE_50000',    size: '€50.000', sizeShort: '€50K',  capital: '€50.000', taxa1: '€599', taxa2: '€449', split1: '80%', split2: '80%', popular: false },
];

const FEATURES_1STEP = [
  { icon: Trophy,     label: 'Target profit', value: '40%' },
  { icon: Clock,      label: 'Durată evaluare', value: '30 zile' },
  { icon: ShieldCheck,label: 'Max drawdown', value: '8%' },
  { icon: ShieldCheck,label: 'Pierdere zilnică', value: '5%' },
  { icon: Wallet,     label: 'Retrageri', value: 'Săptămânal' },
];

const FEATURES_2STEP = [
  { icon: Trophy,     label: 'Faza 1 target', value: '30%' },
  { icon: Trophy,     label: 'Faza 2 target', value: '20%' },
  { icon: Clock,      label: 'Durată per fază', value: '30 zile' },
  { icon: ShieldCheck,label: 'Max drawdown', value: '8%' },
  { icon: ShieldCheck,label: 'Pierdere zilnică', value: '5%' },
  { icon: RefreshCw,  label: 'Taxă', value: 'Rambursată' },
];

export default function PlanuriSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'1step' | '2step'>('2step');
  const [selectedId, setSelectedId] = useState<PlanId>('ADVANCED_10000');
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const features = mode === '1step' ? FEATURES_1STEP : FEATURES_2STEP;
  const selected = PLANS.find(p => p.id === selectedId)!;
  const fee = mode === '1step' ? selected.taxa1 : selected.taxa2;
  const split = mode === '1step' ? selected.split1 : selected.split2;
  const refundEligible = ['ADVANCED_10000', 'PRO_25000', 'ELITE_50000'].includes(selectedId);

  const handleConfirmedCheckout = async () => {
    setShowDisclaimer(false);
    setLoading(selectedId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedId, mode }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error === 'Neautentificat') router.push('/autentificare/login');
    } finally {
      setLoading(null);
    }
  };

  const handleCheckout = () => setShowDisclaimer(true);

  return (
    <section id="planuri" className="py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
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

        {/* 1-Step / 2-Step toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border p-1" style={{ borderColor: 'var(--border)', background: 'white' }}>
            {(['1step', '2step'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer"
                style={mode === m
                  ? { background: 'var(--red)', color: 'white', boxShadow: '0 4px 14px rgba(230,57,70,0.32)' }
                  : { background: 'transparent', color: 'var(--text-muted)' }}>
                {m === '1step' ? '1-Step Challenge' : '2-Step Challenge'}
                {m === '2step' && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: mode === '2step' ? 'rgba(255,255,255,0.25)' : '#fff1f2', color: mode === '2step' ? 'white' : 'var(--red)' }}>
                    Recomandat
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Account size selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PLANS.map(p => (
            <button key={p.id} onClick={() => setSelectedId(p.id)}
              className="relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer"
              style={selectedId === p.id
                ? { background: 'var(--text)', color: 'white', boxShadow: '0 4px 14px rgba(15,23,42,0.18)' }
                : { background: 'white', color: 'var(--text)', border: '1px solid var(--border)' }}>
              {p.sizeShort}
              {p.popular && selectedId !== p.id && (
                <span className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider"
                  style={{ background: 'var(--red)', color: 'white' }}>
                  TOP
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Single plan card — TFP style */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'white',
            border: selected.popular ? '2px solid var(--red)' : '1px solid var(--border)',
            boxShadow: selected.popular ? '0 12px 40px rgba(230,57,70,0.18)' : '0 8px 30px rgba(15,23,42,0.06)',
          }}>

          {selected.popular && (
            <div className="text-center py-2 text-xs font-bold tracking-widest text-white"
              style={{ background: 'var(--red)' }}>
              ⭐ MOST POPULAR
            </div>
          )}

          <div className="grid md:grid-cols-2">

            {/* Left — pricing */}
            <div className="p-8 md:p-10 md:border-r" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                Cont {mode === '1step' ? '1-Step' : '2-Step'}
              </div>
              <div className="text-5xl md:text-6xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>
                {selected.capital}
              </div>
              <div className="text-sm mb-8" style={{ color: 'var(--text-subtle)' }}>capital alocat pentru picks</div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-extrabold" style={{ color: 'var(--red)' }}>{fee}</span>
                <span className="text-base" style={{ color: 'var(--text-muted)' }}>taxă unică</span>
              </div>
              {refundEligible && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-6"
                  style={{ background: '#dcfce7', color: '#15803d' }}>
                  <RefreshCw className="w-3 h-3" />
                  Rambursată la prima retragere
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl mt-6"
                style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Profit Split</div>
                  <div className="text-3xl font-extrabold mt-1" style={{ color: 'var(--red)' }}>{split}</div>
                </div>
                <Trophy className="w-10 h-10" style={{ color: 'var(--red)', opacity: 0.4 }} />
              </div>

              <button onClick={handleCheckout} disabled={loading === selectedId}
                className="w-full mt-6 font-bold text-sm py-4 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#c0202d'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--red)'; }}>
                {loading === selectedId ? 'Se procesează...' : `Cumpără ${selected.size} ${mode === '1step' ? '1-Step' : '2-Step'}`}
              </button>
            </div>

            {/* Right — features */}
            <div className="p-8 md:p-10" style={{ background: 'var(--bg-alt2)' }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-muted)' }}>
                Ce primești
              </div>
              <ul className="space-y-3.5">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg"
                        style={{ background: 'white', border: '1px solid var(--border)' }}>
                        <Icon className="w-4 h-4" style={{ color: 'var(--red)' }} />
                      </span>
                      <span className="flex-1 font-medium" style={{ color: 'var(--text)' }}>{f.label}</span>
                      <span className="font-extrabold" style={{ color: 'var(--text)' }}>{f.value}</span>
                    </li>
                  );
                })}
                <li className="flex items-center gap-3 text-sm pt-2 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--red)' }} />
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Toate sporturile permise (NBA, NFL, EPL, UFC, ATP)</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--red)' }} />
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Acces Discord & calculatoare profesionale</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--red)' }} />
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Plată în 24-48h (transfer bancar / crypto)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-subtle)' }}>
          Plățile securizate prin Stripe · KYC verificat prin Sumsub · Fără abonament, niciodată
        </p>
      </div>
      <CheckoutDisclaimer
        open={showDisclaimer}
        planLabel={`${selected.size} · ${mode === '1step' ? '1-Step' : '2-Step'} · ${fee} taxă unică`}
        onConfirm={handleConfirmedCheckout}
        onCancel={() => setShowDisclaimer(false)}
      />
    </section>
  );
}
