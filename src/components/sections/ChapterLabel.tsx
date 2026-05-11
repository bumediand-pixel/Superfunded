'use client';
/**
 * Marker vizual între cele 3 piloni narativi ai homepage-ului:
 *   01 — Ce-ți oferim       (what we sell)
 *   02 — De ce contează      (why the customer should care)
 *   03 — Ce urmează          (concrete next step)
 *
 * Apare lipit de secțiunea care urmează. Ține-l minimalist —
 * scopul e să marcheze structura, nu să fure atenția.
 */
import { motion } from 'framer-motion';

type Props = {
  number: '01' | '02' | '03';
  title: string;
  sub: string;
  /** Background tone — default white, dark when capitolul vine peste o secțiune neagră */
  variant?: 'light' | 'dark';
};

export default function ChapterLabel({ number, title, sub, variant = 'light' }: Props) {
  const isDark = variant === 'dark';
  return (
    <section className="relative py-20 sm:py-28" style={{ background: isDark ? '#0a0a0a' : 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">

          {/* Big chapter number */}
          <div className="flex items-baseline gap-3 shrink-0">
            <span className="font-extrabold tracking-tighter leading-none"
              style={{
                fontSize: 'clamp(72px, 12vw, 160px)',
                color: 'var(--red, #e63946)',
                lineHeight: 0.85,
              }}>
              {number}
            </span>
            <span className="h-px w-12 sm:w-16" style={{ background: 'var(--red, #e63946)' }} />
          </div>

          {/* Title + sub */}
          <div className="flex-1 sm:pb-4">
            <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2"
              style={{ color: 'var(--red, #e63946)' }}>
              Capitolul {number}
            </div>
            <h2 className="font-extrabold tracking-tight leading-[1.05] mb-3"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                color: isDark ? '#fff' : 'var(--text, #0f172a)',
              }}>
              {title}
            </h2>
            <p className="text-base sm:text-lg max-w-2xl"
              style={{ color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--text-muted, #64748b)' }}>
              {sub}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
