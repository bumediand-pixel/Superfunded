'use client';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { BlurText } from '@/components/BlurText';

const STATS = [
  { value: '2.400+', label: 'Bettori Activi',     numeric: 2400, suffix: '+' },
  { value: '€1.2M+', label: 'Profit Distribuit',  numeric: null, suffix: null },
  { value: '80%',    label: 'Split Profit Maxim', numeric: 80,   suffix: '%' },
  { value: '48h',    label: 'Aprobare KYC',        numeric: null, suffix: null },
];

function CountUp({ target, suffix, once }: { target: number; suffix: string; once: boolean }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!once || started.current) return;
    started.current = true;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [once, target]);

  return <>{display.toLocaleString('ro-RO')}{suffix}</>;
}

function StatCard({ value, label, numeric, suffix, delay }: typeof STATS[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="flex flex-col items-center md:items-start gap-3 px-4 md:px-0">
      <span className="font-display italic text-5xl md:text-6xl lg:text-7xl leading-none text-[hsl(var(--cream))]">
        {numeric !== null
          ? <CountUp target={numeric} suffix={suffix ?? ''} once={inView} />
          : value}
      </span>
      <span className="font-body text-sm text-[hsla(var(--cream)/0.55)] uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function StatisticiSection() {
  return (
    <section className="relative py-32 md:py-44 overflow-hidden border-t border-[hsla(var(--cream)/0.08)]">
      {/* Background video — shows when /public/videos/stats-bg.mp4 exists */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover saturate-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <source src="/videos/stats-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient fades */}
      <div className="absolute top-0 inset-x-0 h-[200px] gradient-fade-t pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[200px] gradient-fade-b pointer-events-none" />

      {/* Content card */}
      <div className="relative z-10 max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        <div className="liquid-glass rounded-3xl p-10 md:p-14">
          <div className="mb-10 md:mb-14">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
              Rezultate reale
            </span>
            <BlurText
              text="Numere care vorbesc de la sine."
              as="h2"
              className="mt-4 font-display uppercase text-3xl md:text-5xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[22ch]"
              delay={0.07}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
            {STATS.map((s, i) => (
              <StatCard key={i} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
