'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { SplineScene } from '@/components/ui/splite';
import { TrendingUp, Shield, Zap, Trophy } from 'lucide-react';

const STATS = [
  { n: '2.400+', l: 'Bettori Activi', icon: TrendingUp },
  { n: '€1.2M+', l: 'Profit Plătit', gold: true, icon: Trophy },
  { n: '9',      l: 'Sporturi',       icon: Zap },
  { n: '48h',    l: 'Aprobare KYC',   icon: Shield },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, delay },
});

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.4 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center" style={{ background: 'var(--black-0)' }}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Spotlight */}
      <Spotlight className="-top-40 left-0 md:left-1/4 md:-top-20" fill="rgba(230,57,70,0.7)" />

      {/* Mesh gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[60%] h-[60%]" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(230,57,70,0.12) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%]" style={{ background: 'radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-0 pt-10">

        {/* LEFT — text */}
        <div className="flex-1 flex flex-col">

          {/* Eyebrow badge */}
          <motion.div {...fadeIn(0.2)} className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 border text-xs font-mono tracking-[0.2em] uppercase"
              style={{ borderColor: 'rgba(230,57,70,0.4)', background: 'rgba(230,57,70,0.08)', color: 'var(--red)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Live · Platforma #1 România
            </div>
          </motion.div>

          {/* Headline — Bodoni Moda, luxury serif */}
          <div className="mb-6 overflow-hidden">
            <motion.div {...fadeUp(0.3)}>
              <h1 className="font-bodoni leading-[0.92] tracking-tight text-white"
                style={{ fontSize: 'clamp(54px, 8.5vw, 128px)' }}>
                Pariezi.
              </h1>
            </motion.div>
            <motion.div {...fadeUp(0.45)}>
              <h1 className="font-bodoni leading-[0.92] tracking-tight italic"
                style={{ fontSize: 'clamp(54px, 8.5vw, 128px)', color: 'var(--red)' }}>
                Noi finanțăm.
              </h1>
            </motion.div>
            <motion.div {...fadeUp(0.6)}>
              <h1 className="font-bodoni leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(54px, 8.5vw, 128px)', WebkitTextStroke: '1.5px rgba(201,168,76,0.6)', color: 'transparent' }}>
                Tu câștigi.
              </h1>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div {...fadeIn(0.75)}
            className="w-16 h-px mb-7"
            style={{ background: 'linear-gradient(90deg, var(--red), var(--gold))' }}
          />

          {/* Subtitle — Jost */}
          <motion.p {...fadeUp(0.8)}
            className="font-jost max-w-md text-base md:text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            Capital până la{' '}
            <span className="font-semibold text-white">€50.000</span>.
            {' '}Păstrezi{' '}
            <span className="font-semibold text-white">80%</span> din profit.
            {' '}Fără riscul banilor proprii.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.95)} className="flex flex-wrap gap-3 mb-14">
            <Link href="/planuri"
              className="relative overflow-hidden font-jost font-semibold text-sm tracking-[0.08em] px-8 py-3.5 text-white transition-all duration-300 group"
              style={{ background: 'var(--red)', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
              <span className="relative z-10">Începe Evaluarea</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, var(--red-hot), var(--red))' }} />
            </Link>
            <Link href="/#cum-functioneaza"
              className="font-jost font-medium text-sm tracking-[0.08em] px-8 py-3.5 border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}>
              Cum Funcționează
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(1.1)} className="flex flex-wrap gap-8 md:gap-10">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <s.icon className="w-4 h-4 shrink-0" style={{ color: s.gold ? 'var(--gold)' : 'var(--red)', opacity: 0.8 }} />
                <div>
                  <div className="font-bodoni text-xl md:text-2xl" style={{ color: s.gold ? 'var(--gold)' : 'var(--white-hi)' }}>{s.n}</div>
                  <div className="font-jost text-[10px] uppercase tracking-[0.16em] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Spline 3D */}
        <motion.div
          {...fadeIn(0.6)}
          className="flex-1 relative w-full lg:w-auto"
          style={{ height: 'clamp(360px, 55vh, 680px)' }}>

          {/* Glow behind 3D */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,57,70,0.15) 0%, transparent 70%)' }} />

          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />

          {/* Floating badge */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-4 md:right-8 px-4 py-2.5 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <div className="font-jost text-[10px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Split profit</div>
            <div className="font-bodoni text-2xl text-white">80%</div>
            <div className="font-jost text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>pentru tine</div>
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-12 left-4 md:left-8 px-4 py-2.5 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(230,57,70,0.3)' }}>
            <div className="font-jost text-[10px] uppercase tracking-widest" style={{ color: 'var(--red)' }}>Capital max</div>
            <div className="font-bodoni text-2xl text-white">€50K</div>
            <div className="font-jost text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>fără risc propriu</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(2)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 origin-top"
          style={{ background: 'linear-gradient(to bottom, var(--red), transparent)' }} />
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--white-lo)' }}>scroll</span>
      </motion.div>
    </section>
  );
}
