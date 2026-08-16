'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LINKS = [
  ['/#cum-functioneaza', 'Cum Funcționează'],
  ['/planuri', 'Planuri'],
  ['/calculators', 'Calculatoare'],
  ['/clasament', 'Clasament'],
  ['/blog', 'Blog'],
  ['/afiliere', 'Afiliere'],
  ['/faq', 'FAQ'],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled ? 'top-2' : 'top-4'
        }`}
        style={{ width: 'min(100% - 2rem, 1100px)' }}
      >
        <div className="liquid-glass rounded-full px-5 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-display text-xl tracking-wider text-[hsl(var(--cream))] shrink-0 uppercase" aria-label="SuperFunded — acasă">
            Super<span className="text-[hsl(var(--red))]">Funded</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="font-body text-xs font-semibold text-[hsla(var(--cream)/0.65)] hover:text-[hsl(var(--cream))] transition-colors uppercase tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/autentificare/login"
              className="font-body text-xs font-semibold text-[hsla(var(--cream)/0.65)] hover:text-[hsl(var(--cream))] transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/autentificare/register"
              className="font-body text-xs font-bold px-5 py-2 rounded-full bg-[hsl(var(--red))] text-white hover:bg-[hsl(0,72%,44%)] transition-colors"
            >
              Începe
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-[hsl(var(--cream))]"
            onClick={() => setOpen(!open)}
            aria-label="Meniu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current rounded transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current rounded transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current rounded transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden mt-2 liquid-glass-strong rounded-2xl p-6 flex flex-col gap-4">
            {LINKS.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="font-body text-sm font-semibold text-[hsla(var(--cream)/0.75)] hover:text-[hsl(var(--cream))] transition-colors py-1"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-[hsla(var(--cream)/0.10)]">
              <Link
                href="/autentificare/login"
                className="text-center font-body text-sm font-semibold py-3 rounded-full liquid-glass text-[hsl(var(--cream))]"
              >
                Login
              </Link>
              <Link
                href="/autentificare/register"
                className="text-center font-body text-sm font-bold py-3 rounded-full bg-[hsl(var(--red))] text-white"
              >
                Începe Acum
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
