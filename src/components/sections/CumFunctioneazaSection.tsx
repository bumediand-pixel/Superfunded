'use client';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Wallet } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const STEPS = [
  {
    n: '01',
    Icon: Target,
    title: 'Alegi Challenge-ul',
    body: 'Capital de la €500 la €50K, 1-Step sau 2-Step. Taxă unică, fără abonamente, fără costuri ascunse.',
  },
  {
    n: '02',
    Icon: TrendingUp,
    title: 'Atingi Targetul',
    body: 'Pariezi profitabil respectând limitele de risc. La 2-Step nu există presiune de timp — mergi în ritmul tău.',
  },
  {
    n: '03',
    Icon: Wallet,
    title: 'Câștigi cu Banii Noștri',
    body: 'Primești cont finanțat și pariezi pe bune. Iei 70–80% din profit, plătit săptămânal, garantat.',
  },
];

export default function CumFunctioneazaSection() {
  return (
    <section id="cum-functioneaza" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        {/* Header */}
        <div className="mb-16">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            Cum funcționează
          </span>
          <BlurText
            text="3 pași până la capital."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[18ch]"
            delay={0.08}
          />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {STEPS.map((s, i) => (
            <div key={i} className="relative px-0 md:px-10 py-10 md:py-14 flex flex-col gap-4 items-start border-t border-[hsla(var(--cream)/0.10)] md:border-t-0 md:border-l first:border-l-0">
              {/* Big number */}
              <span className="font-display text-[96px] md:text-[120px] leading-none text-[hsl(var(--red)/0.18)] -mb-4 select-none">
                {s.n}
              </span>

              <div className="liquid-glass-strong rounded-full w-11 h-11 flex items-center justify-center">
                <s.Icon className="size-5 text-[hsl(var(--cream))]" />
              </div>

              <h3 className="font-display uppercase text-2xl md:text-3xl tracking-tight text-[hsl(var(--cream))]">
                {s.title}
              </h3>
              <p className="font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed max-w-[30ch]">
                {s.body}
              </p>

              <motion.div
                className="h-px bg-gradient-to-r from-[hsl(var(--red))] to-transparent w-0"
                whileInView={{ width: '40px' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
