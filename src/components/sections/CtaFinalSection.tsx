'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function CtaFinalSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.cta-bg-orb', {
        scale: 1.3, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
      });
      gsap.fromTo('.cta-content > *', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      // Number count-up
      gsap.fromTo({ n: 0 }, { n: 50000 }, {
        duration: 2, ease: 'power2.out', snap: { n: 1000 },
        onUpdate: function() {
          const el = document.querySelector('.cta-capital-num');
          if (el) el.textContent = '€' + Math.round((this.targets()[0] as { n: number }).n).toLocaleString('ro-RO');
        },
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-40" style={{ background: 'var(--black-0)' }}>
      {/* Deep red orb */}
      <div className="cta-bg-orb absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(230,57,70,0.18) 0%, rgba(230,57,70,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Diagonal lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)' }} />

      <div className="cta-content relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16" style={{ background: 'var(--red)' }} />
          <span className="font-mono text-xs tracking-[0.28em] uppercase" style={{ color: 'var(--red)' }}>Gata să Începi</span>
          <div className="h-px w-16" style={{ background: 'var(--red)' }} />
        </div>

        <h2 className="font-bebas leading-none mb-6" style={{ fontSize: 'clamp(60px, 12vw, 160px)', letterSpacing: '0.02em' }}>
          PARIEZI CU<br/>
          <span style={{ color: 'var(--red)' }}>BANII NOȘTRI</span>
        </h2>

        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          <div className="font-mono text-xs tracking-widest uppercase px-4 py-2" style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
            Capital Maxim
          </div>
          <div className="cta-capital-num font-bebas" style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: 'var(--gold)', letterSpacing: '0.03em' }}>
            €50.000
          </div>
        </div>

        <p className="text-lg mb-12 max-w-lg mx-auto" style={{ color: 'var(--white-mid)' }}>
          Alătură-te celor <span style={{ color: 'var(--white-hi)', fontWeight: 700 }}>2.400+</span> bettori finanțați.
          Taxă unică, profit săptămânal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="#planuri"
            className="font-bold text-sm tracking-[0.14em] uppercase px-12 py-4 text-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(230,57,70,0.6)]"
            style={{ background: 'var(--red)', clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}>
            Alege Planul Tău →
          </Link>
          <Link href="#cum-functioneaza"
            className="font-semibold text-sm tracking-[0.12em] uppercase px-12 py-4 border transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--white-mid)' }}>
            Cum Funcționează
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['Taxă Rambursată la Prima Retragere', 'KYC în 48h', 'Suport 24/7', 'Fără Abonament'].map(item => (
            <div key={item} className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span style={{ color: 'var(--red)', fontSize: '8px' }}>◆</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
