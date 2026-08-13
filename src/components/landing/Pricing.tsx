import Link from 'next/link';
import { Check, ShieldCheck } from 'lucide-react';

interface Tier { name: string; capital: string; fee: string; target: string; drawdown: string; split: string; features: readonly string[]; popular?: boolean; href: string; }

const TIERS: readonly Tier[] = [
  { name: 'Starter', capital: '€1.000', fee: '€35', target: '30% + 20%', drawdown: '10%', split: '70%', features: ['Bankroll virtual €1.000', 'Provocare 2-Step', 'Fără limită de timp', 'Plăți săptămânale'], href: '/planuri?plan=starter' },
  { name: 'Pro', capital: '€10.000', fee: '€139', target: '30% + 20%', drawdown: '10%', split: '80%', features: ['Bankroll virtual €10.000', 'Taxa rambursată la primul payout', 'Acces Discord VIP', 'Plăți săptămânale prioritare'], popular: true, href: '/planuri?plan=pro' },
  { name: 'Elite', capital: '€50.000', fee: '€449', target: '30% + 20%', drawdown: '10%', split: '80%', features: ['Bankroll virtual €50.000', 'Taxa rambursată integral', 'Account manager dedicat', 'Scale-up plan până la €200.000'], href: '/planuri?plan=elite' },
];

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative border-b border-[color:var(--color-ink-800)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-gold-400)]">Planuri</p>
          <h2 id="pricing-title" className="mt-3 font-bebas text-4xl tracking-tight text-white sm:text-5xl">Alege contul potrivit ție</h2>
          <p className="mt-4 text-base text-[color:var(--color-mist-400)]">Taxă unică, fără reînnoiri lunare. Pierzi provocarea? Pierzi doar taxa.</p>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <li key={t.name} className={'relative flex flex-col rounded-2xl border p-7 transition-colors ' + (t.popular ? 'border-[color:var(--color-gold-400)] bg-[color:var(--color-ink-900)] shadow-2xl shadow-amber-900/30' : 'border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/60 hover:border-[color:var(--color-ink-600)]')}>
              {t.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--color-gold-400)] px-3 py-1 text-xs font-bold text-[color:var(--color-ink-950)]">Cel mai popular</span>}
              <div><p className="font-bebas text-2xl tracking-wide text-white">{t.name}</p><p className="mt-1 text-sm text-[color:var(--color-mist-500)]">Bankroll {t.capital}</p></div>
              <p className="mt-6 font-bebas text-5xl text-[color:var(--color-gold-400)]">{t.fee}</p>
              <p className="text-xs text-[color:var(--color-mist-500)]">taxă unică</p>
              <dl className="mt-6 grid grid-cols-3 gap-3 rounded-lg border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-950)]/60 p-3 text-center">
                <div><dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">Target</dt><dd className="mt-1 font-mono text-xs text-[color:var(--color-mist-200)]">{t.target}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">Drawdown</dt><dd className="mt-1 font-mono text-xs text-[color:var(--color-mist-200)]">{t.drawdown}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">Split</dt><dd className="mt-1 font-mono text-xs text-[color:var(--color-volt-400)]">{t.split}</dd></div>
              </dl>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[color:var(--color-mist-200)]">
                {t.features.map((f) => (<li key={f} className="flex items-start gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--color-volt-400)]" /><span>{f}</span></li>))}
              </ul>
              <Link href={t.href} className={'mt-8 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition-colors ' + (t.popular ? 'bg-[color:var(--color-gold-400)] text-[color:var(--color-ink-950)] hover:bg-[color:var(--color-gold-500)]' : 'border border-[color:var(--color-ink-600)] text-[color:var(--color-mist-200)] hover:border-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-400)]')} style={{ minHeight: 48 }}>Alege {t.name}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/60 px-6 py-5 text-center sm:flex-row sm:text-left">
          <ShieldCheck aria-hidden="true" className="h-6 w-6 text-[color:var(--color-volt-400)]" />
          <p className="text-sm text-[color:var(--color-mist-200)]"><strong className="text-white">Garanție 100%:</strong> taxa este rambursată integral la prima retragere de pe contul funded <span className="text-[color:var(--color-mist-500)]">(planuri Pro şi Elite)</span>.</p>
        </div>
      </div>
    </section>
  );
}
