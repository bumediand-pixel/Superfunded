import Link from 'next/link';

const links = {
  legal: [
    { href: '/termeni', label: 'Termeni & Condiții' },
    { href: '/confidentialitate', label: 'Confidențialitate' },
    { href: '/disclaimer', label: 'Cookies & Disclaimer' },
  ],
  product: [
    { href: '/planuri', label: 'Planuri' },
    { href: '/cum-functioneaza', label: 'Cum funcționează' },
    { href: '/calculators', label: 'Calculatoare' },
    { href: '/faq', label: 'FAQ' },
  ],
  company: [
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Despre' },
    { href: '/afiliere', label: 'Affiliate' },
  ],
} as const;

export default function LandingFooter() {
  return (
    <footer
      aria-labelledby="landing-footer-title"
      className="bg-[color:var(--color-ink-950)] px-4 pt-16 pb-10"
    >
      <h2 id="landing-footer-title" className="sr-only">
        Subsol
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-[color:var(--color-ink-800)] pb-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-bebas text-2xl tracking-wider text-white">
              SUPERFUNDED
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[color:var(--color-mist-400)]">
              Platformă de betting prop firm pentru pariori funded.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                aria-label="Acces interzis sub 18 ani"
                className="inline-flex h-9 items-center rounded-full border border-[color:var(--color-gold-400)] px-3 text-xs font-bold text-[color:var(--color-gold-400)]"
              >
                18+
              </span>
              {/* REPLACE: confirm wording with legal once ONJN status is final */}
              <span className="text-xs text-[color:var(--color-mist-500)]">
                Joacă responsabil · Status ONJN: REPLACE
              </span>
            </div>
          </div>

          <FooterCol title="Produs" items={links.product} />
          <FooterCol title="Companie" items={links.company} />
          <FooterCol title="Legal" items={links.legal} />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-[color:var(--color-mist-500)] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} SuperFunded. Toate drepturile
            rezervate.
          </p>
          <ul className="flex items-center gap-4">
            {/* REPLACE: real social URLs */}
            <li>
              <Link href="https://discord.gg/superfunded" className="hover:text-white">
                Discord
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/superfunded" className="hover:text-white">
                X / Twitter
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-mist-400)]">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[color:var(--color-mist-200)] transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
