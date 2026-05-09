import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden border-b border-[color:var(--color-ink-800)] px-4 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_30%,color-mix(in_oklab,var(--color-gold-500)_20%,transparent),transparent_70%)]"
      />
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-gold-400)]">
          Începe astăzi
        </p>
        <h2
          id="final-cta-title"
          className="font-bebas text-5xl leading-[0.95] text-white sm:text-6xl"
        >
          Cont funded în 7 zile.
          <span className="block text-[color:var(--color-gold-400)]">
            Începe acum.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-[color:var(--color-mist-400)]">
          Taxă unică, reguli clare, plată săptămânală. Riști doar taxa de
          evaluare — capitalul e al nostru.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/planuri"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gold-400)] px-7 text-base font-semibold text-[color:var(--color-ink-950)] transition-colors hover:bg-[color:var(--color-gold-500)] hover:text-white"
          >
            Începe provocarea
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="#faq"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[color:var(--color-ink-600)] px-7 text-base font-semibold text-[color:var(--color-mist-200)] transition-colors hover:border-[color:var(--color-gold-400)] hover:text-white"
          >
            Mai am întrebări
          </Link>
        </div>

        <p className="mt-6 text-xs text-[color:var(--color-mist-500)]">
          18+ · Joacă responsabil · Conformitate ONJN — vezi disclaimer
        </p>
      </div>
    </section>
  );
}
