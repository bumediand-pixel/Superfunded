'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurText } from '@/components/BlurText';

const FAQ = [
  { q: 'Ce este SuperFunded?', a: 'SuperFunded e o platformă de evaluare a abilităților de betting. Treci evaluarea, primești un cont finanțat și câștigi din profitul real pe care îl generezi. Nu suntem cazinou — operăm ca platformă de skill evaluation.' },
  { q: 'Cum funcționează evaluarea?', a: 'Ai două opțiuni: 1-Step (o singură fază, țintă 40% profit în 30 de zile) sau 2-Step (două faze — 30% în prima, 20% în a doua, fără limită de timp). Atingi ținta respectând regulile de risc, primești contul finanțat.' },
  { q: 'Care e diferența dintre 1-Step și 2-Step?', a: '1-Step: o singură țintă de 40%, split 70%, 30 de zile. 2-Step: două faze (30% + 20%), split 80%, fără presiune de timp. 2-Step e mai relaxat și plătește mai bine — de aia îl recomandăm.' },
  { q: 'Care sunt regulile de risc?', a: 'Pierdere zilnică maximă: 5% din sold. Drawdown total maxim: 8% din capitalul inițial. Depășești o limită, evaluarea se închide. Poți reîncerca cu 20% reducere la taxă.' },
  { q: 'Când primesc banii?', a: 'Retragerile se procesează în 24–48 de ore lucrătoare. Prima retragere îți rambursează integral taxa de challenge. Plata vine prin transfer bancar sau crypto (USDT/BTC).' },
  { q: 'E nevoie de KYC?', a: 'Da, o singură dată — înainte de prima retragere. Durează 24–48 de ore și ai nevoie de un act de identitate valid și o dovadă de rezidență.' },
  { q: 'E legal SuperFunded în România?', a: 'Da. Operăm ca platformă de evaluare a abilităților, nu ca operator de pariuri. Nu plasăm pariuri reale și nu avem licență de gambling — intrăm în categoria evaluărilor de performanță bazate pe skill.' },
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
            text="Întrebări? Răspundem direct."
            as="h2"
            className="mt-4 font-display uppercase text-4xl md:text-5xl leading-[0.9] tracking-tight text-[hsl(var(--cream))]"
            delay={0.08}
          />
          <p className="mt-6 font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed max-w-[32ch]">
            Nu găsești ce cauți? Scrie-ne — îți răspundem în 24–48h lucrătoare.
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
