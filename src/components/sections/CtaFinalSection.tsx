'use client';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const TRUST = [
  'Taxă rambursată la prima retragere',
  'KYC în 48h',
  'Fără abonament',
  'Retrageri în 24-48h',
];

const FOOTER_LINKS = [
  ['/confidentialitate', 'Confidențialitate'],
  ['/termeni', 'Termeni'],
  ['/rambursare', 'Rambursare'],
  ['/afiliere', 'Afiliere'],
];

export default function CtaFinalSection() {
  return (
    <section className="relative min-h-[100vh] flex flex-col border-t border-[hsla(var(--cream)/0.08)] overflow-hidden bg-[hsl(var(--ink))]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden="true"
        style={{ filter: 'brightness(0.40) saturate(0.6)' }}
      >
        <source src="/videos/cta-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[hsl(var(--ink)/0.55)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[200px] gradient-fade-t pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-[var(--gutter)] py-32 max-w-[var(--max)] mx-auto w-full">
        <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block mb-6">
          Gata să începi?
        </span>

        <BlurText
          text="Gata să pariezi cu noi?"
          as="h2"
          className="font-display italic uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.88] tracking-tight text-[hsl(var(--cream))] mb-8 max-w-[16ch]"
          delay={0.08}
        />

        <p className="font-body text-base md:text-lg text-[hsla(var(--cream)/0.65)] max-w-[42ch] mb-12 leading-relaxed">
          Alege planul potrivit, treci evaluarea, și primești capital real. Fără riscuri pentru tine.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <Link
            href="/planuri"
            className="rounded-full px-10 py-4 font-body font-semibold text-sm bg-[hsl(var(--red))] text-white hover:bg-[hsl(0,72%,44%)] transition-colors"
          >
            Alege Planul Tău
          </Link>
          <Link
            href="#cum-functioneaza"
            className="liquid-glass-strong rounded-full px-10 py-4 font-body font-semibold text-sm text-[hsl(var(--cream))] hover:bg-[hsla(var(--cream)/0.08)] transition-colors"
          >
            Cum funcționează
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
          {TRUST.map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-[hsla(var(--cream)/0.55)]">
              <CheckCircle className="size-3.5 text-[hsl(var(--red)/0.80)]" />
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-[hsla(var(--cream)/0.08)] py-6 px-[var(--gutter)]">
        <div className="max-w-[var(--max)] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-[hsla(var(--cream)/0.35)]">
            &copy; {new Date().getFullYear()} SuperFunded. Toate drepturile rezervate.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="font-body text-xs text-[hsla(var(--cream)/0.40)] hover:text-[hsla(var(--cream)/0.80)] transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
