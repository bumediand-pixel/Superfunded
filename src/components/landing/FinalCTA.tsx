import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(247,201,72,0.18) 0%, transparent 60%), linear-gradient(180deg, rgba(11,14,22,0) 0%, rgba(11,14,22,1) 100%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2
          id="final-cta-title"
          className="font-bebas text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Cont funded în 7 zile.
          <br />
          <span className="text-[color:var(--color-gold-400)]">Începe acum.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-[color:var(--color-mist-400)] sm:text-lg">
          Fără birocrație, fără bani personali în joc, fără surprize. Doar tu, cota și banii noștri.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/planuri"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--color-gold-400)] px-8 py-4 text-base font-bold text-[color:var(--color-ink-950)] shadow-xl shadow-amber-900/40 transition-colors hover:bg-[color:var(--color-gold-500)]"
            style={{ minHeight: 48 }}
          >
            Începe provocarea
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link
            href="#faq"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-ink-600)] px-8 py-4 text-base font-semibold text-[color:var(--color-mist-200)] transition-colors hover:border-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-400)]"
            style={{ minHeight: 48 }}
          >
            Mai am întrebări
          </Link>
        </div>
      </div>
    </section>
  );
}
