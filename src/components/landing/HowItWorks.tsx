import { Target, TrendingUp, WalletMinimal } from 'lucide-react';

const steps = [
  {
    n: '01',
    Icon: Target,
    title: 'Alegi un plan (taxă unică)',
    body:
      'Selectezi mărimea contului funded. Plătești o singură taxă pentru evaluare — fără abonament, fără reînnoiri ascunse.',
  },
  {
    n: '02',
    Icon: TrendingUp,
    title: 'Treci de provocare',
    body:
      'Atinge targetul de profit fără să depășești drawdown-ul maxim. Reguli clare, pariezi pe ce sport vrei, în ritmul tău.',
  },
  {
    n: '03',
    Icon: WalletMinimal,
    title: 'Primești cont funded',
    body:
      'Capitalul nostru, profitul tău. Păstrezi 80% din câștiguri, plătit săptămânal direct în contul tău bancar sau pe card.',
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
            Cum funcționează
          </p>
          <h2
            id="how-title"
            className="font-bebas text-4xl leading-tight text-white sm:text-5xl"
          >
            Trei pași până la primul payout
          </h2>
          <p className="mt-4 text-[color:var(--color-mist-400)]">
            Modelul prop firm, adaptat pentru pariori sportivi. Fără riscuri
            personale pe bankroll, fără surprize la retragere.
          </p>
        </header>

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ n, Icon, title, body }) => (
            <li key={n} className="landing-card relative p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-ink-900)] text-[color:var(--color-gold-400)] ring-1 ring-[color:var(--color-ink-700)]"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-[color:var(--color-mist-500)]">
                  {n}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-mist-400)]">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
