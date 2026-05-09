import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Hero — Server Component.
 * H1 ships as plain text in the initial HTML payload (LCP-friendly).
 * Hero image gets `priority` + `fetchPriority="high"` + explicit width/height.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="landing-glow relative isolate overflow-hidden border-b border-[color:var(--color-ink-800)] px-4 pt-20 pb-16 sm:pt-28 sm:pb-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/70 px-3 py-1 text-xs font-medium tracking-wide text-[color:var(--color-mist-400)]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-volt-400)]"
            />
            Platforma de betting prop firm pentru pariori funded
          </p>

          <h1
            id="hero-title"
            className="font-bebas text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Pariază cu banii noștri.
            <span className="block text-[color:var(--color-gold-400)]">
              Păstrează profitul.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--color-mist-400)] sm:text-lg">
            Treci de o provocare de pariere cu reguli clare și primești un cont
            funded cu capital propriu. Tu pariezi, noi suportăm riscul — păstrezi
            până la 80% din profit, plătit săptămânal.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/planuri"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gold-400)] px-6 text-sm font-semibold text-[color:var(--color-ink-950)] transition-colors hover:bg-[color:var(--color-gold-500)] hover:text-white"
            >
              Începe provocarea
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="#how"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[color:var(--color-ink-600)] bg-transparent px-6 text-sm font-semibold text-[color:var(--color-mist-200)] transition-colors hover:border-[color:var(--color-gold-400)] hover:text-white"
            >
              Cum funcționează
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--color-ink-800)] pt-6 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                Plătit până acum
              </dt>
              {/* REPLACE: TOTAL_PAID_RON — pull from /api/payouts/total or CMS */}
              <dd className="mt-1 font-mono text-lg font-semibold text-white">
                REPLACE_RON
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                Plăți securizate
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-[color:var(--color-mist-200)]">
                {/* REPLACE: swap to real Stripe / Visa / Mastercard SVG marks */}
                <span className="rounded border border-[color:var(--color-ink-700)] px-2 py-0.5 text-[10px] font-semibold tracking-wider">
                  STRIPE
                </span>
                <span className="rounded border border-[color:var(--color-ink-700)] px-2 py-0.5 text-[10px] font-semibold tracking-wider">
                  VISA
                </span>
                <span className="rounded border border-[color:var(--color-ink-700)] px-2 py-0.5 text-[10px] font-semibold tracking-wider">
                  MC
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                Vârstă minimă
              </dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-sm text-[color:var(--color-mist-200)]">
                <span
                  aria-label="Acces interzis sub 18 ani"
                  className="rounded-full border border-[color:var(--color-gold-400)] px-2 py-0.5 text-[11px] font-bold text-[color:var(--color-gold-400)]"
                >
                  18+
                </span>
                Joacă responsabil
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-[color:var(--color-mist-500)]">
                Conformitate
              </dt>
              {/* REPLACE: confirm exact ONJN status / wording with legal */}
              <dd className="mt-1 text-xs leading-snug text-[color:var(--color-mist-400)]">
                Disclaimer ONJN — produsul nu este un serviciu de pariuri.
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[color:var(--color-gold-500)]/15 via-transparent to-[color:var(--color-volt-500)]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
            {/* REPLACE: drop a real screenshot at /public/hero/dashboard.webp
                (recommended 1280x800, <120KB). */}
            <Image
              src="/hero/dashboard.webp"
              alt="Captură din contul funded SuperFunded — bankroll, target și drawdown live"
              width={1280}
              height={800}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
