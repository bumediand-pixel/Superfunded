import { Target, TrendingUp, Wallet } from 'lucide-react';

const STEPS = [
  { n: '01', icon: Target, title: 'Alegi un plan (taxă unică)', body: 'Selectezi mărimea contului care ți se potriveşte. Plăteşti o singură taxă, iar capitalul de pariere îți este acordat instant.' },
  { n: '02', icon: TrendingUp, title: 'Treci de provocare', body: 'Atinge target-ul de profit fără să depăşeşti drawdown-ul maxim. Reguli clare, fără capcane ascunse.' },
  { n: '03', icon: Wallet, title: 'Primeşti cont funded', body: 'Păstrezi 80% din profitul net. Retragerile se procesează săptămânal — bani reali, plătiți rapid.' },
] as const;

export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="relative border-b border-[color:var(--color-ink-800)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-gold-400)]">Cum funcționează</p>
          <h2 id="how-title" className="mt-3 font-bebas text-4xl tracking-tight text-white sm:text-5xl">Trei paşi până la primul payout</h2>
          <p className="mt-4 text-base text-[color:var(--color-mist-400)]">Un proces simplu, transparent şi fără surprize. Riscul rămâne al nostru, profitul al tău.</p>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <li key={n} className="group relative rounded-2xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] p-6 transition-colors hover:border-[color:var(--color-gold-400)]/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[color:var(--color-mist-500)]">{n}</span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-ink-800)] text-[color:var(--color-gold-400)]" aria-hidden="true"><Icon className="h-6 w-6" /></span>
              </div>
              <h3 className="mt-6 font-bebas text-2xl tracking-tight text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-mist-400)]">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
