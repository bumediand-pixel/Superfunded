'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrubSequence } from '@/components/ScrubSequence';
import { BlurText } from '@/components/BlurText';
import { FRAMES_PATH, FRAME_COUNT, FRAME_EXT } from '@/lib/constants';

export default function HeroSection() {
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <section ref={scrollRef} className="relative h-[250vh]" aria-label="Hero">
      {/* Sticky canvas viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Scroll-scrubbed frame sequence */}
        <ScrubSequence
          framesPath={FRAMES_PATH}
          frameCount={FRAME_COUNT}
          ext={FRAME_EXT}
          className="absolute inset-0 w-full h-full object-cover"
          scrollTargetRef={scrollRef}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,11,20,0.85) 100%)' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[hsl(var(--ink)/0.45)] pointer-events-none" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-[40vh] gradient-fade-b pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-[var(--max)] mx-auto px-[var(--gutter)]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <span className="liquid-glass rounded-full px-4 py-1.5 text-xs font-semibold text-[hsla(var(--cream)/0.90)] inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--red))] animate-pulse" />
              Platforma #1 Betting Prop Firm · România
            </span>
          </motion.div>

          {/* Headline */}
          <BlurText
            text="Pariezi. Câștigăm. Împărțim."
            as="h1"
            className="font-display uppercase leading-[0.88] tracking-tight text-[hsl(var(--cream))] mb-6 [font-size:clamp(48px,8vw,130px)]"
            delay={0.07}
            startDelay={0.3}
          />

          {/* Sub */}
          <motion.p
            className="font-body text-base md:text-xl text-[hsla(var(--cream)/0.70)] max-w-[44ch] mb-10 leading-relaxed"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Capital până la <strong className="text-[hsl(var(--cream))]">€50.000</strong>. Tu pariezi cu banii noștri, păstrezi până la <strong className="text-[hsl(var(--cream))]">80%</strong> din profit. Retrageri în 24–48h.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Link
              href="/planuri"
              className="rounded-full px-8 py-3.5 font-body font-semibold text-sm bg-[hsl(var(--red))] text-white hover:bg-[hsl(0,72%,44%)] transition-colors"
            >
              Evaluare Gratuită
            </Link>
            <Link
              href="#cum-functioneaza"
              className="liquid-glass-strong rounded-full px-8 py-3.5 font-body font-semibold text-sm text-[hsl(var(--cream))] hover:bg-[hsla(var(--cream)/0.08)] transition-colors"
            >
              Cum funcționează
            </Link>
          </motion.div>

          {/* Partners */}
          <motion.div
            className="absolute bottom-10 left-[var(--gutter)] right-[var(--gutter)] flex items-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <span className="text-[10px] uppercase tracking-widest text-[hsla(var(--cream)/0.35)] font-body">
              Parteneriate active cu
            </span>
            {['Betfair', 'Pinnacle', '1xBet', 'Unibet', 'Bet365'].map(name => (
              <span key={name} className="font-display text-sm tracking-wide text-[hsla(var(--cream)/0.40)]">
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
