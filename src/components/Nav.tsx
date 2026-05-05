'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Cum Funcționează', href: '/#cum-functioneaza' },
  { label: 'Planuri',          href: '#planuri' },
  { label: 'Testimoniale',     href: '#testimoniale' },
  { label: 'FAQ',              href: '#faq' },
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
    <nav
      className={`fixed z-50 transition-all duration-300 ${
        scrolled ? 'top-2' : 'top-4'
      } left-1/2 -translate-x-1/2 w-[min(1200px,calc(100vw-32px))]`}
    >
      {/* Main pill */}
      <div className="liquid-glass rounded-full px-2 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 pl-3 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'hsl(var(--red))' }}
          >
            <span className="font-display text-white text-xs tracking-wider leading-none">SF</span>
          </div>
          <span className="font-display text-lg tracking-tight text-[hsl(var(--cream))]">
            SuperFunded
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm text-[hsla(var(--cream)/0.75)] hover:text-[hsl(var(--cream))] transition-colors font-body"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/autentificare/login"
            className="hidden md:block text-sm font-semibold px-4 py-2 rounded-full text-[hsla(var(--cream)/0.70)] hover:text-[hsl(var(--cream))] transition-colors"
          >
            Autentificare
          </Link>
          <Link
            href="/autentificare/register"
            className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--ink))]"
            style={{ background: 'hsl(var(--red))' }}
          >
            Începe Acum
            <ArrowUpRight className="size-4" />
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-full text-[hsl(var(--cream))] hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))]"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Închide meniu' : 'Deschide meniu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden mt-2 liquid-glass-strong rounded-2xl px-5 py-6 flex flex-col gap-4">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-base font-semibold py-1 text-[hsla(var(--cream)/0.80)] hover:text-[hsl(var(--cream))] transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-[hsla(var(--cream)/0.12)]">
            <Link
              href="/autentificare/login"
              className="text-center text-sm font-semibold py-3 rounded-full border border-[hsla(var(--cream)/0.20)] text-[hsla(var(--cream)/0.75)] hover:border-[hsla(var(--cream)/0.40)] transition-colors"
              onClick={() => setOpen(false)}
            >
              Autentificare
            </Link>
            <Link
              href="/autentificare/register"
              className="text-center text-sm font-bold py-3 rounded-full text-white"
              style={{ background: 'hsl(var(--red))' }}
              onClick={() => setOpen(false)}
            >
              Începe Acum
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
