'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, Shield, Zap, Trophy, CheckCircle } from 'lucide-react';

const STATS = [
  { n: '2.400+', l: 'Bettori Activi', icon: TrendingUp },
  { n: '€1.2M+', l: 'Profit Plătit', icon: Trophy },
  { n: '9', l: 'Sporturi', icon: Zap },
  { n: '48h', l: 'Aprobare KYC', icon: Shield },
];

const PERKS = [
  'Capital până la €50.000',
  'Păstrezi 80% din profit',
  'Fără limită de timp',
  'Retrageri în 24-48h',
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const spring = { stiffness: 60, damping: 20 };
  const bgY    = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '20%']), spring);
  const textY  = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '12%']), spring);
  const cardY  = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '6%']), spring);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative pt-24 pb-20 overflow-hidden bg-white">
      {/* Subtle bg glow — parallax slowest */}
      <motion.div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none" style={{ y: bgY }}>
        <div className="w-full h-full" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(230,57,70,0.07) 0%, transparent 60%)' }} />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT */}
          <motion.div className="flex-1 max-w-2xl" style={{ y: textY, opacity }}>
            <motion.div {...fadeUp(0.1)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: '#fff1f2', color: 'var(--red)', border: '1px solid #fecdd3' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--red)' }} />
              Platforma #1 Betting Prop Firm · România
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              className="font-jakarta font-extrabold leading-[1.06] tracking-tight mb-5"
              style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', color: 'var(--text)' }}>
              Pariezi cu{' '}
              <span style={{ color: 'var(--red)' }}>banii noștri.</span>
              <br />Tu păstrezi profitul.
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Demonstrezi că știi să pariezi, noi îți dăm capitalul. Păstrezi până la{' '}
              <strong style={{ color: 'var(--text)' }}>80%</strong> din fiecare câștig — fără riscul banilor proprii.
            </motion.p>

            <motion.ul {...fadeUp(0.35)} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-9">
              {PERKS.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--red)' }} />
                  {p}
                </li>
              ))}
            </motion.ul>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-3 mb-8">
              <Link href="/planuri"
                className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl text-white transition-all duration-200 cursor-pointer"
                style={{ background: 'var(--red)', boxShadow: '0 4px 14px rgba(230,57,70,0.3)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='#c0202d'; el.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--red)'; el.style.transform='translateY(0)'; }}>
                Începe Evaluarea →
              </Link>
              <Link href="/#cum-functioneaza"
                className="inline-flex items-center font-semibold text-sm px-7 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-slate-50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                Cum Funcționează
              </Link>
            </motion.div>

            <motion.p {...fadeUp(0.5)} className="text-xs" style={{ color: 'var(--text-subtle)' }}>
              Taxă rambursată la prima retragere · Fără abonament · KYC în 48h
            </motion.p>
          </motion.div>

          {/* RIGHT — mock dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ y: cardY, opacity }}
            className="flex-1 w-full max-w-[480px] relative">

            <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: 'var(--border)' }}>
              {/* Browser chrome */}
              <div className="px-4 py-2.5 flex items-center gap-1.5 border-b" style={{ background: '#f8fafc', borderColor: 'var(--border)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] font-mono" style={{ color: 'var(--text-subtle)' }}>thesuperfunded.com/dashboard</span>
              </div>

              {/* Dashboard */}
              <div className="p-4 bg-white">
                <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                  {[
                    { label: 'Capital', val: '€10.000', color: 'var(--text)' },
                    { label: 'Profit Net', val: '+€1.240', color: '#22c55e' },
                    { label: 'Win Rate', val: '71%', color: 'var(--red)' },
                  ].map(k => (
                    <div key={k.label} className="rounded-lg p-2.5 border text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
                      <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{k.label}</div>
                      <div className="text-sm font-extrabold" style={{ color: k.color }}>{k.val}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg p-3 border mb-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
                  <div className="text-[10px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Evoluție Profit · 14 zile</div>
                  <div className="flex items-end gap-1 h-12">
                    {[30,55,40,70,50,85,60,90,55,88,75,95,80,100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm"
                        style={{ height: `${h}%`, background: h > 50 ? 'rgba(34,197,94,0.55)' : 'rgba(230,57,70,0.4)' }} />
                    ))}
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  <div className="grid grid-cols-4 px-3 py-1.5 text-[10px] font-semibold" style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}>
                    {['Sport', 'Eveniment', 'Cotă', 'Profit'].map(h => <span key={h}>{h}</span>)}
                  </div>
                  {[
                    { sport: 'Fotbal', ev: 'Real vs Barca', cota: '1.85', profit: '+€170', pos: true },
                    { sport: 'Tenis', ev: 'Djokovic vs Alcaraz', cota: '2.10', profit: '+€165', pos: true },
                    { sport: 'Baschet', ev: 'Lakers vs Warriors', cota: '1.92', profit: '-€100', pos: false },
                  ].map((b, i) => (
                    <div key={i} className="grid grid-cols-4 px-3 py-2 text-[10px] border-t" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{b.sport}</span>
                      <span className="truncate" style={{ color: 'var(--text)' }}>{b.ev}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{b.cota}</span>
                      <span className="font-bold" style={{ color: b.pos ? '#22c55e' : 'var(--red)' }}>{b.profit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 hidden lg:block z-10">
              <div className="px-4 py-2.5 rounded-xl shadow-xl border bg-white text-center" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>Split Profit</div>
                <div className="text-2xl font-extrabold" style={{ color: 'var(--red)' }}>80%</div>
                <div className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>pentru tine</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 pt-10 border-t grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ borderColor: 'var(--border)' }}>
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#fff1f2' }}>
                <s.icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
              </div>
              <div>
                <div className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{s.n}</div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
