'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '@/components/BlurText';

const FAQ = [
  { q: 'Ce este SuperFunded?', a: 'SuperFunded este o platformă de evaluare a abilităților de betting bazată pe performanță. Utilizatorii care demonstrează abilități constante primesc acces la un cont finanțat și câștigă real din profiturile generate. Nu suntem un cazino — operăm ca platformă de evaluare a skill-ului.' },
  { q: 'Cum funcționează procesul de evaluare?', a: 'Există două tipuri de challenge: 1-Step (un singur pas, target de 40% profit în 30 de zile) și 2-Step (două faze: 30% în Faza 1, 20% în Faza 2, fără limită de timp). Odată ce atingi targetul respectând regulile de risc, primești contul finanțat.' },
  { q: 'Care este diferența dintre 1-Step și 2-Step?', a: '1-Step Challenge: un singur target de 40% profit, split de 70%, limită de 30 de zile. 2-Step Challenge: două faze consecutive (30% + 20%), split de până la 80%, fără limită de timp. Mai mult timp, condiții mai blânde și split mai bun.' },
  { q: 'Care sunt regulile de risc?', a: 'Limita de pierdere zilnică: 5% din soldul contului. Limita de pierdere totală (drawdown maxim): 8% din capitalul inițial. Dacă depășești oricare dintre aceste limite, evaluarea se încheie. Poți reîncerca cu o reducere de 20% la taxa inițială.' },
  { q: 'Cum și când primesc plățile?', a: 'Retragerile sunt procesate în 24-48 ore lucrătoare. Prima retragere include și rambursarea integrală a taxei de challenge. Plata se face via transfer bancar sau crypto (USDT/BTC).' },
  { q: 'Este necesar KYC?', a: 'Da. Înainte de prima retragere, toți utilizatorii trebuie să completeze procesul KYC (Know Your Customer). Procesul durează 24-48 ore și necesită un act de identitate valabil și dovadă de rezidență.' },
  { q: 'SuperFunded este legal în România?', a: 'SuperFunded operează ca platformă de evaluare a abilităților, nu ca operator de pariuri. Nu plasăm pariuri reale și nu deținem licență de gambling. Activitățile noastre se încadrează în categoria evaluărilor de performanță bazate pe skill.' },
];

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[hsla(var(--cream)/0.10)]">
      <button
        className="w-full text-left py-6 flex items-center justify-between gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))]"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span
          className="font-display uppercase text-lg md:text-xl tracking-tight transition-colors"
          style={{ color: open ? 'hsl(var(--red))' : 'hsl(var(--cream))' }}
        >
          {q}
        </span>
        <ChevronDown
          className="size-5 shrink-0 transition-transform duration-300 text-[hsla(var(--cream)/0.50)]"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 font-body text-[15px] leading-relaxed text-[hsla(var(--cream)/0.65)] max-w-[60ch]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)] grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16">
        {/* Left — sticky title */}
        <div className="md:sticky md:top-24 md:self-start">
          <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
            Întrebări frecvente
          </span>
          <BlurText
            text="Ai întrebări? Avem răspunsuri."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-5xl leading-[0.9] tracking-tight text-[hsl(var(--cream))]"
            delay={0.08}
          />
          <p className="mt-6 font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed max-w-[32ch]">
            Nu găsești răspunsul? Echipa noastră răspunde în 24-48h lucrătoare.
          </p>
          <Link
            href="mailto:support@superfunded.ro"
            className="liquid-glass-strong mt-8 inline-flex items-center gap-1.5 text-sm font-normal text-[hsl(var(--cream))] rounded-full px-7 py-3.5 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--cream)/0.40)]"
          >
            Contactează-ne
          </Link>
        </div>

        {/* Right — accordion */}
        <div>
          {FAQ.map((item, i) => (
            <AccordionItem
              key={i}
              q={item.q}
              a={item.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
