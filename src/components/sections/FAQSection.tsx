'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { BlurText } from '@/components/BlurText';

const FAQ_ITEMS = [
  {
    q: 'Ce este SuperFunded?',
    a: 'SuperFunded este o platformă prop betting din România. Îți oferim capital (€500–€50.000) cu care faci pick-uri sportive. Tu păstrezi 70–80% din profit, noi riscăm banii noştri.',
  },
  {
    q: 'Cum funcționează evaluarea?',
    a: 'Alegi un challenge (1-Step sau 2-Step), plăteşti taxa unică şi primeşti un cont de evaluare. Trebuie să atingi target-ul de profit respectând limitele de risc zilnic şi total. Odată trecut, primeşti cont finanțat real.',
  },
  {
    q: 'Cât costă un challenge?',
    a: 'Taxa variază în funcție de capitalul ales: de la €19 pentru €500 capital până la €449 pentru €50.000. Taxa se rambursează complet la prima retragere de profit din contul finanțat.',
  },
  {
    q: 'Cât durează procesul KYC?',
    a: 'Verificarea de identitate durează maximum 48 de ore lucrătoare. Ai nevoie de un document de identitate valabil (CI sau paşaport) şi o dovadă de adresă.',
  },
  {
    q: 'Când şi cum primesc banii?',
    a: 'Procesăm retragerile în fiecare săptămână. Poți alege transfer bancar SEPA (2–3 zile) sau crypto (USDT/BTC, sub 24h). Nu există comision de retragere din partea noastră.',
  },
  {
    q: 'Pariaurile live şi combinate sunt permise?',
    a: 'Da, pe toate planurile. Poți paria live, pre-match şi combinate pe toate cele 9 sporturi disponibile. Nu există restricții de piață.',
  },
  {
    q: 'Ce se întâmplă dacă pierd evaluarea?',
    a: 'Dacă depăşeşti limitele de risc sau nu atingi target-ul (la 1-Step), evaluarea se resetează. Poți recămpăra challenge-ul cu o taxă redusă (50% discount pentru al doilea attempt).',
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[hsla(var(--cream)/0.10)]">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="font-body font-semibold text-sm md:text-base text-[hsl(var(--cream))] group-hover:text-[hsla(var(--cream)/0.85)] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`size-4 text-[hsla(var(--cream)/0.50)] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-[hsla(var(--cream)/0.60)] leading-relaxed pb-5 max-w-[55ch]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative py-28 md:py-40 border-t border-[hsla(var(--cream)/0.08)] bg-[hsl(var(--ink))]">
      <div className="max-w-[var(--max)] mx-auto px-[var(--gutter)]">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-xs text-[hsla(var(--cream)/0.80)] inline-block">
              Întrebări frecvente
            </span>
            <BlurText
              text="Tot ce vrei să ştii."
              as="h2"
              className="mt-4 font-display uppercase text-4xl md:text-5xl leading-[0.9] tracking-tight text-[hsl(var(--cream))] max-w-[14ch]"
              delay={0.08}
            />
            <p className="mt-6 font-body text-sm text-[hsla(var(--cream)/0.55)] leading-relaxed max-w-[32ch]">
              Nu găseşti răspunsul? Scrie-ne direct pe Discord sau email şi îți răspundem în cel mult 2 ore.
            </p>
            <Link
              href="mailto:support@thesuperfunded.com"
              className="inline-block mt-6 liquid-glass rounded-full px-5 py-2.5 font-body text-sm text-[hsl(var(--cream))] hover:bg-[hsla(var(--cream)/0.08)] transition-colors"
            >
              Contactă-ne →
            </Link>
          </div>
          <div>
            {FAQ_ITEMS.map((item, i) => (
              <Item key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
