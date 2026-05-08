'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

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
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm border-b border-slate-100' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="SuperFunded — acasă">
          <BrandLogo size={32} text variant="light" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              className="text-sm font-semibold transition-colors duration-200 hover:text-red-500"
              style={{ color: 'var(--text-muted)' }}>
              {label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/autentificare/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors hover:bg-slate-100"
            style={{ color: 'var(--text-muted)' }}>
            Autentificare
          </Link>
          <Link href="/autentificare/register"
            className="text-sm font-bold px-5 py-2.5 rounded-lg text-white transition-all duration-200 hover:shadow-lg cursor-pointer"
            style={{ background: 'var(--red)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--red-dark)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--red)'}>
            Începe Acum
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 rounded-md cursor-pointer" onClick={() => setOpen(!open)}
          style={{ color: 'var(--text)' }}>
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} style={{ background: 'var(--text)' }} />
            <span className={`block h-0.5 rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} style={{ background: 'var(--text)' }} />
            <span className={`block h-0.5 rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2.5' : ''}`} style={{ background: 'var(--text)' }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t px-4 py-5 flex flex-col gap-4 bg-white"
          style={{ borderColor: 'var(--border)' }}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              className="text-base font-semibold py-1 transition-colors hover:text-red-500"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/autentificare/login"
              className="text-center text-sm font-semibold py-2.5 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Autentificare
            </Link>
            <Link href="/autentificare/register"
              className="text-center text-sm font-bold py-2.5 rounded-lg text-white"
              style={{ background: 'var(--red)' }}>
              Începe Acum
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
