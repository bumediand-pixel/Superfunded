import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const TOTAL_PAID_RON = '€1.2M+';

export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-[color:var(--color-ink-800)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 18% 12%, rgba(247,201,72,0.10) 0%, transparent 55%), radial-gradient(circle at 82% 88%, rgba(43,211,72,0.06) 0%, transparent 60%)' }} />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/landing" className="font-bebas text-2xl tracking-wider text-[color:var(--color-mist-200)]" aria-label="SuperFunded — acasă">
          SUPER<span className="text-[color:var(--color-gold-400)]">FUNDED</span>
        </Link>
        <nav aria-label="Navigare principală" className="flex items-center gap-2 text-sm">
          <Link href="/autentificare/login"
            className="rounded-md px-3 py-2 text-[color:var(--color-mist-400)] transition-colors hover:text-[color:var(--color-mist-200)]"
            style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center' }}>
            Autentificare
          </Link>
        </nav>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16 lg:pb-28">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)]/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[color:var(--color-gold-400)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-volt-400)]" />
            Platformă de betting prop firm
          </p>
          <h1 className="font-bebas text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Pariază cu banii noştri.
            <br />
            <span className="text-[color:var(--color-gold-400)]">Păstrează profitul.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--color-mist-400)] sm:text-lg">
            Treci de provocare, primeşti un cont funded cu capitalul nostru şi păstrezi 80% din
            profitul net — plătit săptămânal, fără să rişti vreodată banii tăi.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/planuri"
              className="inline-flex items-center justify-center rounded-md bg-[color:var(--color-gold-400)] px-6 py-4 text-base font-bold text-[color:var(--color-ink-950)] shadow-lg shadow-amber-900/30 transition-colors hover:bg-[color:var(--color-gold-500)]"
              style={{ minHeight: 48 }}>
              Începe provocarea
            </Link>
            <Link href="#how"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--color-ink-600)] bg-transparent px-6 py-4 text-base font-semibold text-[color:var(--color-mist-200)] transition-colors hover:border-[color:var(--color-gold-400)] hover:text-[color:var(--color-gold-400)]"
              style={{ minHeight: 48 }}>
              Cum funcționează
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[color:var(--color-mist-500)]">
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[color:var(--color-volt-400)]" />
              <span>Plătit total: <strong className="text-[color:var(--color-mist-200)]">{TOTAL_PAID_RON}</strong></span>
            </li>
            <li className="rounded border border-[color:var(--color-ink-700)] px-2 py-1 font-mono" aria-label="Plăți procesate prin Stripe">Stripe</li>
            <li className="rounded border border-[color:var(--color-ink-700)] px-2 py-1 font-mono" aria-hidden="true">VISA</li>
            <li className="rounded border border-[color:var(--color-ink-700)] px-2 py-1 font-mono" aria-hidden="true">MC</li>
            <li className="rounded bg-[color:var(--color-ink-800)] px-2 py-1 font-bold text-[color:var(--color-gold-400)]">18+</li>
          </ul>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[color:var(--color-ink-700)] bg-[color:var(--color-ink-900)] shadow-2xl shadow-black/60">
            <Image src="/hero/dashboard.webp" alt="Captură din dashboard-ul SuperFunded" width={1024} height={768} priority fetchPriority="high" sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
