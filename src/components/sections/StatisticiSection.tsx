'use client';
import { useRef } from 'react';
import { useCounterAnimation } from '@/components/animations/useScrollAnimations';

const STATS = [
  { count: 2400,    suffix: '+',  label: 'Bettori Activi',   sub: 'conturi active' },
  { count: 1200000, suffix: '€',  label: 'Profit Plătit',    sub: 'total distribuit', highlight: true },
  { count: 9,       suffix: '',   label: 'Sporturi',          sub: 'piețe disponibile' },
  { count: 94,      suffix: '%',  label: 'Rată Satisfacție',  sub: 'sondaj intern 2024' },
];

export default function StatisticiSection() {
  const ref = useRef<HTMLElement>(null);
  useCounterAnimation(ref);

  return (
    <section ref={ref} className="py-16 border-y" style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0" style={{ '--tw-divide-color': 'var(--border)' } as React.CSSProperties}>
          {STATS.map((s, i) => (
            <div key={i} className="px-6 py-8 text-center">
              <div className="text-3xl md:text-4xl font-extrabold mb-1.5 font-jakarta"
                style={{ color: s.highlight ? 'var(--red)' : 'var(--text)' }}>
                <span data-count={s.count}>0</span>{s.suffix}
              </div>
              <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
