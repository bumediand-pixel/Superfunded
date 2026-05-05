'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Layers, Wallet, Globe, BarChart3, Zap } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const SERVICES = [
  {
    Icon: TrendingUp,
    title: 'Challenge 1-Step',
    body: 'O singură fază. Țintă 40% profit în 30 de zile. Split 70% după finanțare.',
  },
  {
    Icon: Layers,
    title: 'Challenge 2-Step',
    body: 'Două faze (30% + 20%), fără limită de timp. Split 80% — condiții mai relaxate, câștig mai mare.',
  },
  {
    Icon: Wallet,
    title: 'Capital până la €50K',
    body: 'Treci evaluarea, primești contul finanțat. Banii sunt ai noștri, profitul îl iei tu — săptămânal.',
  },
  {
    Icon: Globe,
    title: 'Live & Combinate',
    body: 'Live și combinate permise pe toate planurile. 9 sporturi, zero restricții de piață.',
  },
  {
    Icon: BarChart3,
    title: 'Dashboard Complet',
    body: 'Win rate, ROI, profit pe sport, evoluție zilnică. Toate cifrele tale, în timp real.',
  },
  {
    Icon: Zap,
    title: 'Retrageri Săptămânale',
    body: 'Plăți în fiecare săptămână, prin transfer bancar sau crypto (USDT/BTC). Prima retragere îți rambursează taxa.',
  },
];

const cardSizes = [
  'md:row-span-2 md:col-span-1 min-h-[300px]',
  'md:col-span-1 min-h-[220px]',
  'md:col-span-1 min-h-[220px]',
  'md:col-span-2 min-h-[220px]',
  'md:col-span-1 min-h-[220px]',
  'md:col-span-3 min-h-[180px]',
];

export default function ServicesBento() {
  return (
    <section id="servicii" className="relative py-28 md:py-40 bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            Ce oferim
          </span>
          <BlurText
            text="Tot ce-ți trebuie. Într-un singur cont."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[20ch]"
            delay={0.08}
          />
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              className={`liquid-glass rounded-2xl p-6 md:p-8 relative overflow-hidden group ${cardSizes[i]}`}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <div className="liquid-glass-strong rounded-full w-11 h-11 flex items-center justify-center mb-5">
                <s.Icon className="size-5 text-[hsl(var(--cream))]" />
              </div>
              <h3 className="font-display uppercase text-2xl md:text-3xl leading-[0.95] tracking-tight mb-3 max-w-[18ch] text-[hsl(var(--cream))]">
                {s.title}
              </h3>
              <p className="font-body text-sm text-[hsla(var(--cream)/0.60)] max-w-[38ch] leading-relaxed">
                {s.body}
              </p>
              <ArrowUpRight className="absolute top-6 right-6 size-5 text-[hsla(var(--cream)/0.25)] group-hover:text-[hsla(var(--cream)/0.75)] transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
