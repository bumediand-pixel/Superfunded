'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Clock, Eye, Award } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const REASONS = [
  { Icon: ShieldCheck, title: 'Risc Zero',            body: 'Pariezi cu capitalul nostru. Daca pierzi, pierdem noi. Tu nu risci niciun euro din buzunar.' },
  { Icon: Clock,       title: 'KYC in 48h',           body: 'Verificare identitate rapida. Trimiti documentele, noi aprobam in maximum 48 de ore lucratoare.' },
  { Icon: Eye,         title: 'Transparenta Totala',  body: 'Dashboard complet cu istoricul pick-urilor, ROI, win rate si statistici pe sport in timp real.' },
  { Icon: Award,       title: 'Certificat Excelenta', body: 'Bettori cu performanta constanta primesc certificat si pot accesa planuri premium cu split mai mare.' },
];

export default function PourquoiSection() {
  return (
    <section className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        <div className="mb-14 md:mb-20">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            De ce noi
          </span>
          <BlurText
            text="De ce SuperFunded?"
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))]"
            delay={0.08}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((r, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.4 });
            return (
              <motion.div
                key={i}
                ref={ref}
                className="liquid-glass rounded-2xl p-7 flex flex-col gap-5 relative overflow-hidden"
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="liquid-glass-strong rounded-full w-11 h-11 flex items-center justify-center">
                  <r.Icon className="size-5 text-[hsl(var(--cream))]" />
                </div>
                <div>
                  <h3 className="font-display uppercase text-2xl tracking-tight text-[hsl(var(--cream))] mb-2">
                    {r.title}
                  </h3>
                  <p className="font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed">
                    {r.body}
                  </p>
                </div>
                <motion.div
                  className="h-px bg-gradient-to-r from-[hsl(var(--red))] to-transparent w-0 mt-auto"
                  whileInView={{ width: '48px' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
