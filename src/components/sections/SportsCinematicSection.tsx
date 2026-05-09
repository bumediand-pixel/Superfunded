'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SCENES = [
  {
    sport: 'Fotbal',
    headline: 'Joacă la cel mai înalt nivel',
    sub: 'Premier League · Champions League · La Liga',
    stat: '€50K', statLabel: 'capital maxim disponibil',
    accent: '#16a34a', field: 'football',
  },
  {
    sport: 'Tenis',
    headline: 'Fiecare set, o oportunitate',
    sub: 'ATP · WTA · Wimbledon · Roland Garros',
    stat: '80%', statLabel: 'din profit îl păstrezi tu',
    accent: '#0284c7', field: 'tennis',
  },
  {
    sport: 'Baschet',
    headline: 'Jocul mare cere capital mare',
    sub: 'NBA · Euroleague · competiții naționale',
    stat: '2.400+', statLabel: 'bettori finanțați activ',
    accent: '#ea580c', field: 'basketball',
  },
  {
    sport: 'MMA / UFC',
    headline: 'Cunoașterea ta. Capitalul nostru.',
    sub: 'UFC · Bellator · ONE Championship · PFL',
    stat: '€1.2M+', statLabel: 'profit total plătit',
    accent: '#E63946', field: 'mma',
  },
];

/* ── SVG Sport Fields ── */
function FootballField() {
  return (
    <svg viewBox="0 0 900 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="900" height="500" fill="#15803d" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 100} y="0" width="50" height="500" fill="#166534" opacity="0.45" />
      ))}
      <rect x="40" y="30" width="820" height="440" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <line x1="450" y1="30" x2="450" y2="470" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <circle cx="450" cy="250" r="65" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <circle cx="450" cy="250" r="4" fill="rgba(255,255,255,0.9)" />
      <rect x="40" y="150" width="130" height="200" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <rect x="40" y="195" width="48" height="110" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <rect x="730" y="150" width="130" height="200" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <rect x="812" y="195" width="48" height="110" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <rect x="12" y="215" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <rect x="860" y="215" width="28" height="70" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <path d="M40,30 Q56,30 56,46" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M860,30 Q844,30 844,46" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M40,470 Q56,470 56,454" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <path d="M860,470 Q844,470 844,454" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <circle cx="170" cy="250" r="55" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="6 5" />
      <circle cx="730" cy="250" r="55" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="6 5" />
    </svg>
  );
}

function TennisCourt() {
  return (
    <svg viewBox="0 0 900 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="900" height="500" fill="#1e40af" />
      <rect x="110" y="55" width="680" height="390" fill="#1d4ed8" />
      <rect x="110" y="55" width="680" height="390" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" />
      <line x1="450" y1="55" x2="450" y2="445" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <line x1="110" y1="165" x2="790" y2="165" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <line x1="110" y1="335" x2="790" y2="335" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
      <line x1="110" y1="250" x2="790" y2="250" stroke="rgba(255,255,255,0.9)" strokeWidth="4" />
      <rect x="100" y="240" width="12" height="20" fill="white" />
      <rect x="788" y="240" width="12" height="20" fill="white" />
      <line x1="170" y1="55" x2="170" y2="445" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <line x1="730" y1="55" x2="730" y2="445" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <line x1="445" y1="162" x2="455" y2="162" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <line x1="445" y1="338" x2="455" y2="338" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
    </svg>
  );
}

function BasketballCourt() {
  return (
    <svg viewBox="0 0 900 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="900" height="500" fill="#92400e" />
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 23} x2="900" y2={i * 23} stroke="#78350f" strokeWidth="1" opacity="0.7" />
      ))}
      <rect x="45" y="35" width="810" height="430" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
      <line x1="450" y1="35" x2="450" y2="465" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <circle cx="450" cy="250" r="65" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <path d="M45,115 L185,115 A165,165 0 0 1 185,385 L45,385" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
      <path d="M855,115 L715,115 A165,165 0 0 0 715,385 L855,385" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
      <rect x="45" y="160" width="165" height="180" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <rect x="690" y="160" width="165" height="180" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
      <circle cx="210" cy="250" r="65" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="9 5" />
      <circle cx="690" cy="250" r="65" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="9 5" />
      <circle cx="85" cy="250" r="18" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
      <circle cx="815" cy="250" r="18" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
    </svg>
  );
}

function MmaOctagon() {
  return (
    <svg viewBox="0 0 900 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="900" height="500" fill="#111111" />
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 26} x2="900" y2={i * 26} stroke="#1a1a1a" strokeWidth="1" />
      ))}
      <polygon points="450,25 640,80 735,250 640,420 450,475 260,420 165,250 260,80"
        fill="#1c1c1c" stroke="#E63946" strokeWidth="3.5" />
      <polygon points="450,75 610,120 685,250 610,380 450,425 290,380 215,250 290,120"
        fill="none" stroke="rgba(230,57,70,0.35)" strokeWidth="1.5" />
      <circle cx="450" cy="250" r="80" fill="none" stroke="rgba(230,57,70,0.4)" strokeWidth="2" />
      <circle cx="450" cy="250" r="5" fill="rgba(230,57,70,0.6)" />
      <line x1="450" y1="25" x2="450" y2="475" stroke="rgba(230,57,70,0.15)" strokeWidth="1" />
      <line x1="165" y1="250" x2="735" y2="250" stroke="rgba(230,57,70,0.15)" strokeWidth="1" />
      <text x="450" y="62" fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="3">RED CORNER</text>
      <text x="450" y="465" fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="3">BLUE CORNER</text>
    </svg>
  );
}

const FIELDS = { football: FootballField, tennis: TennisCourt, basketball: BasketballCourt, mma: MmaOctagon };

/* ── Single horizontal panel ── */
function SportPanel({ scene }: { scene: typeof SCENES[0] }) {
  const Field = FIELDS[scene.field as keyof typeof FIELDS];

  return (
    <div className="relative overflow-hidden flex-shrink-0 w-full snap-center"
      style={{ height: 'min(75vh, 700px)' }}>
      <div className="absolute inset-0">
        <Field />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.75) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${scene.accent}28 0%, transparent 65%)`,
        }} />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-bold mb-6"
          style={{ background: scene.accent, color: 'white', boxShadow: `0 4px 24px ${scene.accent}55` }}>
          <motion.span className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }} />
          {scene.sport}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-extrabold text-white leading-[1.05] tracking-tight mb-4 max-w-3xl"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)', textShadow: '0 3px 24px rgba(0,0,0,0.6)' }}>
          {scene.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg font-medium mb-8"
          style={{ color: 'rgba(255,255,255,0.7)' }}>
          {scene.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center px-10 py-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${scene.accent}55`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)`,
          }}>
          <span className="font-extrabold text-white leading-none" style={{ fontSize: 'clamp(36px, 5.5vw, 70px)' }}>
            {scene.stat}
          </span>
          <span className="text-xs sm:text-sm font-semibold mt-2" style={{ color: scene.accent }}>
            {scene.statLabel}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Main export — horizontal snap carousel ── */
export default function SportsCinematicSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      setActiveIdx(Math.min(SCENES.length - 1, Math.max(0, i)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const accent = SCENES[activeIdx].accent;

  return (
    <section className="relative" style={{ background: '#080808' }}>
      <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #ffffff, transparent)' }} />

      <div
        ref={scrollerRef}
        data-sports-scroller
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        aria-label="Sporturi disponibile">
        {SCENES.map((scene, i) => (
          <SportPanel key={i} scene={scene} />
        ))}
      </div>

      <style>{`[data-sports-scroller]::-webkit-scrollbar { display: none; }`}</style>

      {/* Dots + hint */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2">
          {SCENES.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Mergi la ${s.sport}`}
              className="rounded-full transition-all duration-500 cursor-pointer pointer-events-auto"
              style={{
                width: i === activeIdx ? '32px' : '8px',
                height: '8px',
                background: i === activeIdx ? accent : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] font-semibold"
          style={{ color: 'rgba(255,255,255,0.4)' }}>
          ← scroll orizontal →
        </span>
      </div>

      {/* Arrow buttons (desktop only) */}
      {activeIdx > 0 && (
        <button type="button" onClick={() => scrollTo(activeIdx - 1)} aria-label="Sport anterior"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="text-white text-xl">←</span>
        </button>
      )}
      {activeIdx < SCENES.length - 1 && (
        <button type="button" onClick={() => scrollTo(activeIdx + 1)} aria-label="Sport următor"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="text-white text-xl">→</span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }} />
    </section>
  );
}
