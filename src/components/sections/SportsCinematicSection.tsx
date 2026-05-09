'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Cinematic sports carousel — autoplaying horizontal snap.
 * Each panel pairs a real action photo with a glassmorphic stat card.
 * Photos are sourced from Unsplash (free, royalty-free) and served via
 * their CDN with width/quality params to keep page weight reasonable.
 */
const SCENES = [
  {
    sport: 'Fotbal',
    headline: 'Joacă la cel mai înalt nivel',
    sub: 'Premier League · Champions League · La Liga',
    stat: '€50K', statLabel: 'capital maxim disponibil',
    accent: '#16a34a',
    img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1800&q=80',
    // ⚽ player striking a ball, packed stadium
  },
  {
    sport: 'Tenis',
    headline: 'Fiecare set, o oportunitate',
    sub: 'ATP · WTA · Wimbledon · Roland Garros',
    stat: '80%', statLabel: 'din profit îl păstrezi tu',
    accent: '#0284c7',
    img: 'https://images.unsplash.com/photo-1622279457486-28f993f78165?auto=format&fit=crop&w=1800&q=80',
    // 🎾 tennis player mid-serve under stadium lights
  },
  {
    sport: 'Baschet',
    headline: 'Jocul mare cere capital mare',
    sub: 'NBA · Euroleague · competiții naționale',
    stat: '2.400+', statLabel: 'bettori finanțați activ',
    accent: '#ea580c',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1800&q=80',
    // 🏀 player going up for a dunk
  },
  {
    sport: 'MMA / UFC',
    headline: 'Cunoașterea ta. Capitalul nostru.',
    sub: 'UFC · Bellator · ONE Championship · PFL',
    stat: '€1.2M+', statLabel: 'profit total plătit',
    accent: '#E63946',
    img: 'https://images.unsplash.com/photo-1615117972428-28de87cd9082?auto=format&fit=crop&w=1800&q=80',
    // 🥊 boxing/MMA gloves and fighter silhouette
  },
];

const AUTOPLAY_MS = 5500;

function SportPanel({ scene, active }: { scene: typeof SCENES[0]; active: boolean }) {
  return (
    <div className="relative overflow-hidden flex-shrink-0 w-full snap-center"
      style={{ height: 'min(75vh, 720px)' }}>

      {/* Real photo background — Ken-Burns zoom while active */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${scene.img})` }}
        initial={false}
        animate={{ scale: active ? 1.08 : 1 }}
        transition={{ duration: 7, ease: 'easeOut' }}
      />

      {/* Cinematic dark overlays */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.85) 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 55%, transparent 30%, rgba(0,0,0,0.6) 100%)',
      }} />
      {/* Accent color wash */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 55% 45% at 50% 60%, ${scene.accent}33 0%, transparent 70%)`,
      }} />

      {/* Foreground content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-bold mb-6"
          style={{ background: scene.accent, color: 'white', boxShadow: `0 4px 24px ${scene.accent}55` }}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {scene.sport}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-extrabold text-white leading-[1.05] tracking-tight mb-4 max-w-3xl"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)', textShadow: '0 3px 24px rgba(0,0,0,0.7)' }}>
          {scene.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg font-medium mb-8" style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
          {scene.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex flex-col items-center px-10 py-5 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: `1px solid ${scene.accent}66`,
            boxShadow: `0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)`,
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

export default function SportsCinematicSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Track active panel by horizontal scroll position.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w > 0) setActiveIdx(Math.min(SCENES.length - 1, Math.max(0, Math.round(el.scrollLeft / w))));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Autoplay loop.
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w === 0) return;
      const next = (Math.round(el.scrollLeft / w) + 1) % SCENES.length;
      el.scrollTo({ left: next * w, behavior: 'smooth' });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // Pause when the tab isn't visible.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Preload all images on mount so transitions are instant.
  useEffect(() => {
    SCENES.forEach(s => { const img = new Image(); img.src = s.img; });
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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        aria-label="Sporturi disponibile">
        {SCENES.map((scene, i) => <SportPanel key={i} scene={scene} active={i === activeIdx} />)}
      </div>

      <style>{`[data-sports-scroller]::-webkit-scrollbar { display: none; }`}</style>

      {/* Dots + autoplay status */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2">
          {SCENES.map((s, i) => (
            <button key={i} type="button" onClick={() => scrollTo(i)} aria-label={`Mergi la ${s.sport}`}
              className="rounded-full transition-all duration-500 cursor-pointer pointer-events-auto"
              style={{
                width: i === activeIdx ? '32px' : '8px', height: '8px',
                background: i === activeIdx ? accent : 'rgba(255,255,255,0.3)',
                boxShadow: i === activeIdx ? `0 0 12px ${accent}` : 'none',
              }} />
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {paused ? 'pauză' : `auto · ${AUTOPLAY_MS / 1000}s`} · scroll ←→
        </span>
      </div>

      {/* Desktop arrow buttons */}
      {activeIdx > 0 && (
        <button type="button" onClick={() => scrollTo(activeIdx - 1)} aria-label="Sport anterior"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="text-white text-xl">←</span>
        </button>
      )}
      {activeIdx < SCENES.length - 1 && (
        <button type="button" onClick={() => scrollTo(activeIdx + 1)} aria-label="Sport următor"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="text-white text-xl">→</span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }} />
    </section>
  );
}
