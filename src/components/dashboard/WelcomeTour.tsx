'use client';
import { useState, useEffect } from 'react';
import { X, ArrowRight, Trophy, ShieldCheck, Wallet, Users, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY = 'sf-tour-completed-v2';

const STEPS_NEW = [
  { icon: ShoppingCart, title: 'Bun venit pe SuperFunded',  body: 'Pentru a începe să primești picks evaluate de noi, trebuie întâi să cumperi un challenge funded. Capitalul nostru, picks-urile tale.', cta: { label: 'Vezi planurile', href: '/planuri' } },
  { icon: ShieldCheck,  title: 'Reguli simple',              body: 'Max 5% pierdere zilnică · Max 8% drawdown total · Profit target 30% (Faza 1) + 20% (Faza 2). Nimic ascuns.' },
  { icon: Wallet,       title: 'Plățile săptămânal',         body: 'Pe contul funded poți cere retrageri săptămânal. 24-48h prin transfer bancar, Wise sau crypto. KYC e necesar înainte.' },
  { icon: Users,        title: 'Comunitate Discord',         body: 'Intră pe Discord să vezi alerte de cote, breakdown-uri săptămânale și răspunsuri rapide de la pickeri funded.', cta: { label: 'Discord', href: '/discord' } },
] as const;

const STEPS_FUNDED = [
  { icon: Trophy,      title: 'Bun venit, picker!',          body: 'Contul tău funded este activ. În 30 zile trebuie să atingi target-ul de profit fără să depășești drawdown-ul.' },
  { icon: ShieldCheck, title: 'Reguli simple',               body: 'Max 5% pierdere zilnică · Max 8% drawdown total. Atât. Restul depinde de strategia ta.' },
  { icon: Wallet,      title: 'Plățile săptămânal',          body: 'Pe contul funded poți cere retrageri săptămânal — 24-48h prin transfer bancar, Wise sau crypto. KYC e necesar înainte.' },
  { icon: Users,       title: 'Comunitate Discord',          body: 'Intră pe Discord să vezi alerte de cote, breakdown-uri săptămânale și răspunsuri rapide de la pickeri funded.', cta: { label: 'Discord', href: '/discord' } },
] as const;

export default function WelcomeTour({ hasActiveAccount = false }: { hasActiveAccount?: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
    setOpen(false);
  };

  const STEPS = hasActiveAccount ? STEPS_FUNDED : STEPS_NEW;

  if (!open) return null;
  const s = STEPS[step];
  const Icon = s.icon;
  const last = step === STEPS.length - 1;
  const cta = 'cta' in s ? s.cta : null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-3xl max-w-md w-full p-6 sm:p-8 mx-auto"
        style={{ background: 'var(--dash-surface, #141414)', border: '1px solid var(--dash-border, var(--dash-overlay-8))' }}>

        <div className="flex justify-end mb-2">
          <button onClick={dismiss} aria-label="Închide tutorial"
            className="text-white/30 hover:text-white p-1 cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5"
          style={{ background: 'rgba(230,57,70,0.15)' }}>
          <Icon className="w-6 h-6" style={{ color: 'var(--red, #e63946)' }} />
        </div>

        <h3 className="text-2xl font-extrabold text-white text-center mb-3">{s.title}</h3>
        <p className="text-sm leading-relaxed text-white/60 text-center mb-5">{s.body}</p>

        {cta && (
          <Link href={cta.href} onClick={dismiss}
            className="block text-center text-sm font-bold py-2.5 mb-4 rounded-xl text-white"
            style={{ background: 'rgba(230,57,70,0.15)', border: '1px solid rgba(230,57,70,0.35)', color: 'var(--red, #e63946)' }}>
            {cta.label} →
          </Link>
        )}

        <div className="flex items-center gap-1.5 justify-center mb-6">
          {STEPS.map((_, i) => (
            <span key={i} className="h-1.5 rounded-full transition-all"
              style={{
                background: i === step ? 'var(--red, #e63946)' : 'rgba(255,255,255,0.15)',
                width: i === step ? '20px' : '6px',
              }} />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="flex-1 py-3 text-sm font-bold rounded-xl text-white cursor-pointer"
              style={{ background: 'var(--dash-overlay-5)' }}>
              Înapoiback
            </button>
          )}
          {!last ? (
            <button onClick={() => setStep(step + 1)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl text-white cursor-pointer"
              style={{ background: 'var(--red, #e63946)' }}>
              Mai departe <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={dismiss}
              className="flex-1 py-3 text-sm font-bold rounded-xl text-white cursor-pointer"
              style={{ background: 'var(--red, #e63946)' }}>
              {hasActiveAccount ? 'Începe să pickez →' : 'Hai să încep →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
