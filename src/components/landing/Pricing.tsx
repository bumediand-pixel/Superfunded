import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

type Tier = {
  id: 'starter' | 'pro' | 'elite';
  name: string;
  // REPLACE: confirm exact fee/target/drawdown/split per tier with finance.
  fee: string;
  capital: string;
  target: string;
  drawdown: string;
  split: string;
  features: readonly string[];
  popular?: boolean;
  ctaHref: string;
};

const tiers: readonly Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    fee: 'REPLACE_RON',
    capital: 'REPLACE_RON',
    target: 'REPLACE_%',
    drawdown: 'REPLACE_%',
    split: '80%',
    features: [
      'Provocare într-o singură fază',
      'Toate sporturile permise',
      'Plată săptămânală',
    ],
    ctaHref: '/planuri#starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    fee: 'REPLACE_RON',
    capital: 'REPLACE_RON',
    target: 'REPLACE_%',
    drawdown: 'REPLACE_%',
    split: '80%',
    features: [
      'Provocare în două faze',
      'Cont funded scalabil',
      'Plată săptămânală + bonus performanță',
      'Acces la mentor dedicat',
    ],
    popular: true,
    ctaHref: '/planuri#pro',
  },
  {
    id: 'elite',
    name: 'Elite',
    fee: 'REPLACE_RON',
    capital: 'REPLACE_RON',
    target: 'REPLACE_%',
    drawdown: 'REPLACE_%',
    split: '80%',
    features: [
      'Capital maxim',
      'Reguli relaxate la drawdown zilnic',
      'Plată la cerere (până la 2x/săptămână)',
      'Suport prioritar 24/7',
    ],
    ctaHref: '/planuri#elite',
  },
];

export default function Pricing() {
  return (
    <section
      id="planuri"
      aria-labelledby="pricing-title"
      className="border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
            Planuri
          </p>
          <h2
            id="pricing-title"
            className="font-bebas text-4xl leading-tight text-white sm:text-5xl"
          >
            Alege provocarea care ți se potrivește
          </h2>
          <p className="mt-4 text-[color:var(--color-mist-400)]">
            Taxă unică, fără abonament. Treci de evaluare și primești un cont
            funded cu split de 80% pentru tine.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <li
              key={t.id}
              className={`landing-card relative flex flex-col p-6 sm:p-7 ${
                t.popular
                  ? 'border-[color:var(--color-gold-400)]/60 ring-1 ring-[color:var(--color-gold-400)]/40'
                  : ''
              }`}
            >
              {t.popular ? (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[color:var(--color-gold-400)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-ink-950)]">
                  Cel mai popular
                </span>
              ) : null}

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <p className="mt-1 text-sm text-[color:var(--color-mist-400)]">
                  Capital funded {t.capital}
                </p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-bebas text-5xl text-white">{t.fee}</span>
                <span className="text-xs text-[color:var(--color-mist-500)]">
                  taxă unică
                </span>
              </div>

              <dl className="mb-6 grid grid-cols-3 gap-2 rounded-xl border border-[color:var(--color-ink-800)] bg-[color:var(--color-ink-900)]/60 p-3 text-center">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                    Target
                  </dt>
                  <dd className="mt-0.5 font-mono text-sm font-semibold text-white">
                    {t.target}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                    Drawdown
                  </dt>
                  <dd className="mt-0.5 font-mono text-sm font-semibold text-white">
                    {t.drawdown}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                    Split
                  </dt>
                  <dd className="mt-0.5 font-mono text-sm font-semibold text-[color:var(--color-gold-400)]">
                    {t.split}
                  </dd>
                </div>
              </dl>

              <ul className="mb-8 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[color:var(--color-mist-200)]"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-volt-400)]"
                      strokeWidth={3}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.ctaHref}
                className={`mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${
                  t.popular
                    ? 'bg-[color:var(--color-gold-400)] text-[color:var(--color-ink-950)] hover:bg-[color:var(--color-gold-500)] hover:text-white'
                    : 'border border-[color:var(--color-ink-600)] text-[color:var(--color-mist-200)] hover:border-[color:var(--color-gold-400)] hover:text-white'
                }`}
              >
                Alege {t.name}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[color:var(--color-volt-400)]/30 bg-[color:var(--color-volt-500)]/5 px-6 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-[color:var(--color-mist-200)]">
            <span className="font-semibold text-white">
              Garanție „bani înapoi&rdquo;:
            </span>{' '}
            dacă treci de provocare și nu primești contul funded conform
            regulilor, îți returnăm taxa integral.{' '}
            {/* REPLACE: confirm policy with legal. */}
          </p>
          <span className="rounded-full border border-[color:var(--color-volt-400)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-volt-400)]">
            Garanție integrală
          </span>
        </div>
      </div>
    </section>
  );
}
