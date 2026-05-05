'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { ScrubSequence } from '@/components/ScrubSequence';
import { BlurText } from '@/components/BlurText';
import { FRAMES_PATH, FRAME_COUNT, FRAME_EXT } from '@/lib/constants';

const PARTNERS = ['Betfair', 'Pinnacle', '1xBet', 'Unibet', 'Bet365'];

export default function HeroSection() {
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <section ref={scrollRef} className="relative h-[250vh] bg-[hsl(var(--ink))]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Frame sequence canvas */}
        <ScrubSequence
          framesPath={FRAMES_PATH}
          frameCount={FRAME_COUNT}
          ext={FRAME_EXT}
          scrollTargetRef={scrollRef}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* Cinematic vignette */}
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(120%_80%_at_50%_60%,transparent_40%,rgba(0,0,0,0.60)_100%)]" />

        {/* Dark overlay for readability when frames are absent */}
        <div className="absolute inset-0 z-[1] bg-[hsl(var(--ink))/60]" />

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-[40vh] z-[2] gradient-fade-b" />

        {/* Hero content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="liquid-glass rounded-full px-1 py-1 inline-flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: 'hsl(var(--red))', color: 'white' }}
              >
                Nou
              </span>
              <span className="pr-3 text-sm text-[hsla(var(--cream)/0.85)]">
                Platforma #1 Betting Prop Firm · România
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <BlurText
            text="Pariezi. Câștigăm. Împărțim."
            as="h1"
            className="mt-6 font-display uppercase text-[clamp(48px,8vw,130px)] leading-[0.92] tracking-[-0.01em] text-[hsl(var(--cream))] max-w-[14ch]"
            delay={0.09}
            startDelay={0.15}
          />

          {/* Sub */}
          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 16 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-body text-base md:text-lg text-[hsla(var(--cream)/0.70)] max-w-xl leading-relaxed"
          >
            Capital până la <strong className="text-[hsl(var(--cream))]">€50.000</strong>. Tu demonstrezi că știi să pariezi — noi asigurăm fondurile.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 flex items-center gap-3 flex-wrap justify-center"
          >
            <Link
              href="#planuri"
              className="inline-flex items-center gap-1.5 font-semibold text-sm px-7 py-3.5 rounded-full text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[hsl(var(--red))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--ink))]"
              style={{ background: 'hsl(var(--red))' }}
            >
              Evaluare Gratuită
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/#cum-functioneaza"
              className="liquid-glass-strong inline-flex items-center gap-1.5 text-sm font-normal text-[hsl(var(--cream))] rounded-full px-7 py-3.5 hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[hsl(var(--cream)/0.40)]"
            >
              <Play className="size-4 fill-current" />
              Cum funcționează
            </Link>
          </motion.div>

          {/* Partners */}
          <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-4 px-6">
            <span className="liquid-glass rounded-full px-4 py-1.5 text-xs font-body text-[hsla(var(--cream)/0.80)]">
              Pariuri acceptate la
            </span>
            <div className="flex items-center gap-8 md:gap-14 flex-wrap justify-center">
              {PARTNERS.map(p => (
                <span
                  key={p}
                  className="font-display italic text-xl md:text-2xl text-[hsla(var(--cream)/0.55)] tracking-tight"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
