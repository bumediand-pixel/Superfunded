'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    sport: 'Fotbal',
    tagline: 'Premier League · La Liga · Champions League',
    bg: 'radial-gradient(ellipse 140% 100% at 50% 80%, #0d2e0a 0%, #071a06 45%, #050e04 100%)',
    accent: '#22c55e',
    icon: '⚽',
    stat: '+24% ROI',
    svgContent: (
      <svg viewBox="0 0 800 500" className="w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
        <rect x="60" y="40" width="680" height="420" fill="none" stroke="white" strokeWidth="2"/>
        <line x1="400" y1="40" x2="400" y2="460" stroke="white" strokeWidth="1.5"/>
        <circle cx="400" cy="250" r="90" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="400" cy="250" r="5" fill="white"/>
        <rect x="60" y="150" width="130" height="200" fill="none" stroke="white" strokeWidth="1.5"/>
        <rect x="610" y="150" width="130" height="200" fill="none" stroke="white" strokeWidth="1.5"/>
        <rect x="60" y="190" width="55" height="120" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="685" y="190" width="55" height="120" fill="none" stroke="white" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    sport: 'Baschet',
    tagline: 'NBA · Euroleague · Competiții Naționale',
    bg: 'radial-gradient(ellipse 140% 100% at 50% 80%, #3d1a00 0%, #1f0d00 45%, #0a0500 100%)',
    accent: '#f97316',
    icon: '🏀',
    stat: '+31% ROI',
    svgContent: (
      <svg viewBox="0 0 800 500" className="w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
        {/* Basketball court lines */}
        <rect x="60" y="40" width="680" height="420" fill="none" stroke="white" strokeWidth="2"/>
        <line x1="400" y1="40" x2="400" y2="460" stroke="white" strokeWidth="1.5"/>
        <circle cx="400" cy="250" r="70" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="400" cy="250" r="4" fill="white"/>
        {/* Left key */}
        <rect x="60" y="155" width="190" height="190" fill="none" stroke="white" strokeWidth="1.5"/>
        <path d="M 60 155 A 95 95 0 0 1 60 345" fill="none" stroke="white" strokeWidth="1.5" transform="translate(250,0)"/>
        <circle cx="60" cy="250" r="18" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" transform="translate(190,0)"/>
        {/* Right key */}
        <rect x="550" y="155" width="190" height="190" fill="none" stroke="white" strokeWidth="1.5"/>
        <path d="M 740 155 A 95 95 0 0 0 740 345" fill="none" stroke="white" strokeWidth="1.5" transform="translate(-190,0)"/>
        <circle cx="740" cy="250" r="18" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4" transform="translate(-190,0)"/>
        {/* 3pt arcs */}
        <path d="M 60 110 L 280 110 A 220 220 0 0 1 280 390 L 60 390" fill="none" stroke="white" strokeWidth="1" strokeDasharray="6,4"/>
        <path d="M 740 110 L 520 110 A 220 220 0 0 0 520 390 L 740 390" fill="none" stroke="white" strokeWidth="1" strokeDasharray="6,4"/>
      </svg>
    ),
  },
  {
    sport: 'Tenis',
    tagline: 'ATP · WTA · Grand Slam-uri',
    bg: 'radial-gradient(ellipse 140% 100% at 50% 80%, #1a0d2e 0%, #0e071a 45%, #050408 100%)',
    accent: '#a855f7',
    icon: '🎾',
    stat: '+42% ROI',
    svgContent: (
      <svg viewBox="0 0 800 500" className="w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
        {/* Tennis court */}
        <rect x="100" y="40" width="600" height="420" fill="none" stroke="white" strokeWidth="2"/>
        <line x1="400" y1="40" x2="400" y2="460" stroke="white" strokeWidth="1"/>
        <line x1="100" y1="250" x2="700" y2="250" stroke="white" strokeWidth="2.5"/>
        <line x1="100" y1="115" x2="700" y2="115" stroke="white" strokeWidth="1.5"/>
        <line x1="100" y1="385" x2="700" y2="385" stroke="white" strokeWidth="1.5"/>
        <line x1="220" y1="115" x2="220" y2="385" stroke="white" strokeWidth="1"/>
        <line x1="580" y1="115" x2="580" y2="385" stroke="white" strokeWidth="1"/>
        <line x1="400" y1="115" x2="400" y2="385" stroke="white" strokeWidth="1"/>
        {/* Net posts */}
        <line x1="95" y1="240" x2="95" y2="260" stroke="white" strokeWidth="3"/>
        <line x1="705" y1="240" x2="705" y2="260" stroke="white" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    sport: 'MMA / UFC',
    tagline: 'UFC · Bellator · ONE Championship',
    bg: 'radial-gradient(ellipse 140% 100% at 50% 80%, #1a0a0a 0%, #0f0505 45%, #050202 100%)',
    accent: '#ef4444',
    icon: '🥊',
    stat: '+38% ROI',
    svgContent: (
      <svg viewBox="0 0 800 500" className="w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
        {/* Octagon */}
        <polygon points="400,40 620,120 720,320 620,460 400,480 180,460 80,320 180,120" fill="none" stroke="white" strokeWidth="2.5"/>
        <polygon points="400,80 590,150 680,320 590,430 400,445 210,430 120,320 210,150" fill="none" stroke="white" strokeWidth="1"/>
        <circle cx="400" cy="260" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8,6"/>
        <circle cx="400" cy="260" r="4" fill="white"/>
        <line x1="200" y1="260" x2="600" y2="260" stroke="white" strokeWidth="1"/>
        <line x1="400" y1="100" x2="400" y2="420" stroke="white" strokeWidth="1"/>
      </svg>
    ),
  },
];

export default function SportsCinematicSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      SCENES.forEach((_, i) => {
        const scene = `.scene-${i}`;
        const bg = `.scene-bg-${i}`;
        const fg = `.scene-fg-${i}`;
        const text = `.scene-text-${i}`;
        const pill = `.scene-pill-${i}`;

        // BG zoom when entering
        gsap.fromTo(bg, { scale: 1.2 }, {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
        // Foreground SVG parallax
        gsap.to(fg, {
          y: -80,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        });
        // Text reveal
        gsap.fromTo(text, { opacity: 0, y: 60, scale: 0.96 }, {
          opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 65%', toggleActions: 'play none none reverse' },
        });
        // Pill bounce
        gsap.fromTo(pill, { opacity: 0, x: -30 }, {
          opacity: 1, x: 0, duration: 0.8, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: scene, start: 'top 60%', toggleActions: 'play none none reverse' },
        });
      });

      // Icon ambient float
      gsap.to('.scene-icon', {
        y: -10, rotation: 5, duration: 2.8,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        stagger: { each: 0.5, from: 'random' },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#0a0a0a]">
      <div className="text-center py-20 px-6">
        <span className="text-red-500 text-sm font-bold tracking-widest uppercase">Sporturi</span>
        <h2 className="text-5xl md:text-7xl font-black text-white mt-3 mb-4">CÂMPURI DE VICTORIE</h2>
        <p className="text-white/50 text-lg max-w-lg mx-auto">Pariezi pe cele mai mari sporturi din lume cu capitalul nostru</p>
      </div>

      {SCENES.map((scene, i) => (
        <div key={i} className={`scene-${i} relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center`}>
          {/* BG layer — zooms */}
          <div className={`scene-bg-${i} absolute inset-0 z-0`} style={{ background: scene.bg, transformOrigin: 'center center' }}>
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)`,
            }} />
          </div>

          {/* MID layer — SVG field/court */}
          <div className={`scene-fg-${i} absolute inset-0 z-10`}>
            {scene.svgContent}
          </div>

          {/* FG accent glow */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${scene.accent}18 0%, transparent 70%)`,
          }} />

          {/* Vignette */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)',
          }} />

          {/* Content */}
          <div className={`scene-text-${i} relative z-20 text-center px-6 max-w-3xl`}>
            <span className="scene-icon text-7xl md:text-8xl block mb-6 drop-shadow-2xl">{scene.icon}</span>
            <div className={`scene-pill-${i} inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-5`}
              style={{ borderColor: `${scene.accent}40`, background: `${scene.accent}15` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: scene.accent }} />
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: scene.accent }}>{scene.tagline}</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">{scene.sport.toUpperCase()}</h3>
            <div className="text-3xl font-black" style={{ color: scene.accent }}>{scene.stat}</div>
            <p className="text-white/40 text-sm mt-2">ROI mediu bettor finanțat</p>
          </div>

          {/* Bottom fade into next */}
          <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />
        </div>
      ))}
    </section>
  );
}
