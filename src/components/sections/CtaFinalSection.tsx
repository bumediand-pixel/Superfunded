'use client';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const TRUST = ['Taxă rambursată la prima retragere', 'KYC în 48h', 'Fără abonament', 'Retrageri în 24-48h'];

export default function CtaFinalSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'var(--red)' }}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
          Gata să Începi
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Pariezi cu banii noștri.<br />Tu câștigi.
        </h2>

        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Alătură-te celor <strong className="text-white">2.400+</strong> bettori finanțați.
          Capital până la <strong className="text-white">€50.000</strong>. Profit săptămânal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/planuri"
            className="inline-flex items-center justify-center font-bold text-sm px-10 py-4 rounded-xl transition-all duration-200 cursor-pointer"
            style={{ background: 'white', color: 'var(--red)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
            Alege Planul Tău →
          </Link>
          <Link href="/#cum-functioneaza"
            className="inline-flex items-center justify-center font-semibold text-sm px-10 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer"
            style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            Cum Funcționează
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          {TRUST.map(t => (
            <div key={t} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <CheckCircle className="w-4 h-4 text-white" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
