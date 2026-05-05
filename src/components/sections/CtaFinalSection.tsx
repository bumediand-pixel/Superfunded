'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const FOOTER_LINKS = [
  { label: 'Confidențialitate', href: '/confidentialitate' },
  { label: 'Termeni',           href: '/termeni' },
  { label: 'Rambursare',        href: '/rambursare' },
  { label: 'Afiliere',          href: '/afiliere' },
];

export default function CtaFinalSection() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden border-t border-[hsla(var(--cream)/0.08)]">
      {/* Background video — shows when /public/videos/cta-bg.mp4 exists */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: 'brightness(0.40)' }}
        aria-hidden="true"
      >
        <source src="/videos/cta-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient fades */}
      <div className="absolute top-0 inset-x-0 h-[200px] gradient-fade-t pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[200px] gradient-fade-b pointer-events-none" />

      {/* Dark overlay for readability when video absent */}
      <div className="absolute inset-0 bg-[hsl(var(--ink)/0.70)] pointer-events-none" />

      {/* CTA content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-[var(--gutter)] py-24">
        <BlurText
          text="Gata să pariezi cu noi?"
          as="h2"
          className="font-display italic text-[clamp(48px,9vw,160px)] leading-[0.88] tracking-[-0.02em] text-[hsl(var(--cream))] max-w-[16ch]"
          delay={0.09}
        />

        <p className="mt-8 font-body text-base md:text-lg text-[hsla(var(--cream)/0.70)] max-w-xl">
          Un cont. Un capital. Nicio limită de timp.
        </p>

        <div className="mt-10 flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/autentificare/register"
            className="inline-flex items-center gap-1.5 font-semibold text-sm px-8 py-4 rounded-full text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))]"
            style={{ background: 'hsl(var(--red))' }}
          >
            Începe Acum
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="#planuri"
            className="liquid-glass-strong inline-flex items-center text-sm font-normal text-[hsl(var(--cream))] rounded-full px-8 py-4 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--cream)/0.40)]"
          >
            Vezi Planurile
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex items-center gap-6 flex-wrap justify-center">
          {['Taxă rambursată la prima retragere', 'KYC în 48h', 'Retrageri săptămânale'].map(t => (
            <span key={t} className="font-body text-xs text-[hsla(var(--cream)/0.50)]">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 w-full border-t border-[hsla(var(--cream)/0.10)]">
        <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-body text-xs text-[hsla(var(--cream)/0.40)]">
            © 2026 SuperFunded. Toate drepturile rezervate.
          </span>
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {FOOTER_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-xs text-[hsla(var(--cream)/0.45)] hover:text-[hsla(var(--cream)/0.80)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
