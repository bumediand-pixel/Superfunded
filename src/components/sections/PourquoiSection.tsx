'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Eye, Award } from 'lucide-react';
import { BlurText } from '@/components/BlurText';

const REASONS = [
  {
    Icon: ShieldCheck,
    title: 'Asigurat Integral',
    body: 'Capitalul tău de evaluare este asigurat. Regulile clare și fixe — fără modificări unilaterale, fără surprize după înscriere.',
  },
  {
    Icon: Clock,
    title: 'KYC în 48h',
    body: 'Verificare rapidă de identitate. Odată aprobat, retragerile sunt procesate imediat, fără întârzieri birocratice.',
  },
  {
    Icon: Eye,
    title: 'Transparență 100%',
    body: 'Dashboard live cu toate statisticile tale. Fiecare pariu, fiecare cifră vizibilă în timp real. Nimic ascuns.',
  },
  {
    Icon: Award,
    title: 'Platformă Certificată',
    body: 'Operăm legal ca platformă de evaluare a abilităților. Conformitate deplină cu reglementările române și europene.',
  },
];

export default function PourquoiSection() {
  return (
    <section className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            De ce SuperFunded
          </span>
          <BlurText
            text="Construit pentru bettori serioși."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-6xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[22ch] mx-auto"
            delay={0.08}
          />
          <p className="mt-4 font-body text-base text-[hsla(var(--cream)/0.60)] max-w-lg mx-auto">
            Nu suntem un cazino. Suntem partenerii tăi — tu aduci skill-ul, noi furnizăm capitalul.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((r, i) => (
            <motion.div
              key={i}
              className="liquid-glass rounded-2xl p-7 flex flex-col gap-5 min-h-[260px]"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <div className="liquid-glass-strong rounded-full w-11 h-11 flex items-center justify-center">
                <r.Icon className="size-5 text-[hsl(var(--cream))]" />
              </div>
              <div>
                <h3 className="font-display uppercase text-xl tracking-tight text-[hsl(var(--cream))]">
                  {r.title}
                </h3>
                <p className="mt-2 font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed">
                  {r.body}
                </p>
              </div>
              <div className="mt-auto h-px w-10 bg-gradient-to-r from-[hsl(var(--red))] to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
