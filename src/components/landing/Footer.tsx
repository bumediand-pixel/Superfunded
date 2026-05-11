import Link from 'next/link';

const LINK_COLUMNS: ReadonlyArray<{
  heading: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}> = [
  {
    heading: 'Produs',
    links: [
      { label: 'Planuri', href: '/planuri' },
      { label: 'Cum funcționează', href: '/cum-functioneaza' },
      { label: 'Reguli', href: '/regulile' },
      { label: 'Calculatoare', href: '/calculators' },
      { label: 'Clasament', href: '/clasament' },
    ],
  },
  {
    heading: 'Companie',
    links: [
      { label: 'Despre', href: '/cum-functioneaza' },
      { label: 'Afiliere', href: '/afiliere' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Termeni & Condiții', href: '/termeni' },
      { label: 'Confidențialitate', href: '/confidentialitate' },
      { label: 'Cookies', href: '/confidentialitate#cookies' },
      { label: 'AML / KYC', href: '/aml-kyc' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

const SOCIAL: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Discord', href: 'https://discord.gg/superfunded' }, // REPLACE
  { label: 'X (Twitter)', href: 'https://twitter.com/superfunded' }, // REPLACE
  { label: 'Instagram', href: 'https://instagram.com/superfunded' }, // REPLACE
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-[color:var(--color-ink-800)] bg-[color:var(--color-ink-950)] pt-16 pb-10"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-bebas text-2xl tracking-wider text-white">
              SUPER<span className="text-[color:var(--color-gold-400)]">FUNDED</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-[color:var(--color-mist-400)]">
              Platformă de evaluare a predicțiilor sportive pentru pariori funded. Capital propriu, plată
              săptămânală, suport în română.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[color:var(--color-gold-400)] font-bebas text-base font-bold text-[color:var(--color-gold-400)]"
                aria-label="Disponibil doar pentru utilizatori 18+"
              >
                18+
              </span>
              <div className="text-xs text-[color:var(--color-mist-500)]">
                <p className="font-semibold text-[color:var(--color-mist-200)]">
                  Joacă responsabil
                </p>
                <p>
                  Dacă pariatul devine o problemă, sună la{' '}
                  <a
                    className="underline decoration-[color:var(--color-gold-400)] underline-offset-2"
                    href="tel:0800800099"
                  >
                    0800 800 099
                  </a>
                  .
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs text-[color:var(--color-mist-500)]">
              {/* REPLACE: ONJN_STATUS — text final aprobat de juridic */}
              SuperFunded nu este o casă de pariuri reglementată ONJN. Capitalul de challenge este
              virtual; nu se acceptă pariuri pe bani reali ale utilizatorului.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {LINK_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-mist-200)]">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-[color:var(--color-mist-400)] transition-colors hover:text-[color:var(--color-gold-400)]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-ink-800)] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[color:var(--color-mist-500)]">
            © {new Date().getFullYear()} SuperFunded. Toate drepturile rezervate.
          </p>
          <ul className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-xs text-[color:var(--color-mist-400)] hover:text-[color:var(--color-gold-400)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
