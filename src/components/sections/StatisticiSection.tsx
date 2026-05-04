'use client';
import { useRef } from 'react';
import { useCounterAnimation } from '@/components/animations/useScrollAnimations';

const STATS = [
  { count: 2400,    suffix: '+',  label: 'Bettori Activi',   sub: 'conturi active',       color: 'var(--white-hi)' },
  { count: 1200000, suffix: '€', label: 'Profit Plătit',    sub: 'total distribuit',      color: 'var(--gold)' },
  { count: 9,       suffix: '',  label: 'Sporturi',          sub: 'piețe disponibile',     color: 'var(--white-hi)' },
  { count: 94,      suffix: '%', label: 'Rată Satisfacție',  sub: 'sondaj intern 2024',    color: 'var(--red)' },
];

export default function StatisticiSection() {
  const ref = useRef<HTMLElement>(null);
  useCounterAnimation(ref);

  return (
    <section ref={ref} className="relative py-0 overflow-hidden" style={{ background: 'var(--black-1)', borderTop: '1px solid rgba(230,57,70,0.12)', borderBottom: '1px solid rgba(230,57,70,0.12)' }}>
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
        opacity: 0.4,
      }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ divideColor: 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
          {STATS.map((s, i) => (
            <div key={i} className="relative px-8 py-10 group"
              style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  SYS.{String(i + 1).padStart(2, '0')}
                </span>
                <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: i === 1 ? 'var(--gold)' : i === 3 ? 'var(--red)' : 'rgba(255,255,255,0.3)' }} />
              </div>
              {/* Number */}
              <div className="font-mono font-bold leading-none mb-2" style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color: s.color, letterSpacing: '-0.03em' }}>
                <span data-count={s.count}>0</span>{s.suffix}
              </div>
              {/* Label */}
              <div className="font-bebas tracking-[0.12em] text-lg mb-1" style={{ color: 'var(--white-hi)' }}>{s.label}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>{s.sub}</div>
              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
