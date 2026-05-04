'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      {/* Top micro-ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 h-7 flex items-center justify-between px-6 text-[10px] font-mono tracking-widest"
        style={{ background: 'var(--black-0)', borderBottom: '1px solid rgba(230,57,70,0.12)', color: 'rgba(255,255,255,0.3)' }}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--red)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            LIVE
          </span>
          <span>⚽ EPL &nbsp;·&nbsp; 🎾 ATP &nbsp;·&nbsp; 🏀 NBA &nbsp;·&nbsp; 🥊 UFC</span>
        </div>
        <span style={{ color: 'var(--gold)' }}>SUPERFUNDED v1.0 &nbsp;·&nbsp; RO</span>
      </div>

      {/* Main nav */}
      <nav className={`fixed top-7 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(6,6,6,0.96)] backdrop-blur-xl shadow-[0_1px_0_rgba(230,57,70,0.12)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex items-center justify-center"
              style={{ background: 'var(--red)', clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
              <span className="font-bebas text-white text-sm tracking-wide leading-none">SF</span>
            </div>
            <span className="font-bebas text-xl tracking-wider text-white group-hover:text-red-400 transition-colors"
              style={{ letterSpacing: '0.12em' }}>
              SUPERFUNDED
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              ['/#cum-functioneaza', 'Cum Funcționează'],
              ['/planuri', 'Planuri'],
              ['/regulile', 'Regulile'],
              ['/afiliere', 'Afiliere'],
              ['/faq', 'FAQ'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                className="relative text-xs font-jakarta font-semibold tracking-[0.1em] uppercase transition-colors group"
                style={{ color: 'var(--white-mid)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white-hi)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-mid)')}>
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                  style={{ background: 'var(--red)' }} />
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/autentificare/login"
              className="text-xs font-semibold tracking-widest uppercase px-4 py-2 transition-colors"
              style={{ color: 'var(--white-mid)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--white-hi)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-mid)')}>
              Login
            </Link>
            <Link href="/autentificare/register"
              className="relative overflow-hidden text-xs font-bold tracking-widest uppercase px-5 py-2.5 text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(230,57,70,0.5)]"
              style={{ background: 'var(--red)', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
              Începe Acum
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} style={{ width: open ? '100%' : '100%' }} />
              <span className={`block h-px bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden px-6 py-6 border-t flex flex-col gap-5"
            style={{ background: 'var(--black-1)', borderColor: 'var(--white-lo)' }}>
            {[['/#cum-functioneaza','Cum Funcționează'],['/#planuri','Planuri'],['/regulile','Regulile'],['/afiliere','Afiliere'],['/faq','FAQ']].map(([href, label]) => (
              <Link key={href} href={href} className="font-bebas text-2xl tracking-widest text-white/70 hover:text-white transition-colors" onClick={() => setOpen(false)}>{label}</Link>
            ))}
            <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: 'var(--white-lo)' }}>
              <Link href="/autentificare/login" className="font-semibold text-sm tracking-widest uppercase" style={{ color: 'var(--white-mid)' }}>Login</Link>
              <Link href="/autentificare/register" className="text-center font-bold text-sm tracking-widest uppercase px-5 py-3 text-white" style={{ background: 'var(--red)' }}>Începe Acum</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
