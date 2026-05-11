'use client';
/**
 * "De ce mii de pickeri aleg SuperFunded" — TFP-style feature grid.
 * 6 carduri (3×2 desktop / 1 col mobile) + jucător decorativ pe lateral,
 * estompat la 25% opacity ca să nu fure atenția de la conținut.
 */
import { Zap, Shield, Layers, Maximize2, Wallet, Users } from 'lucide-react';

const CARDS = [
  {
    icon: Zap,
    title: 'Capitalul nostru, picks-urile tale',
    desc: 'Până la €50.000 capital pus la dispoziție. Tu pui pick-urile, noi acoperim riscul.',
  },
  {
    icon: Shield,
    title: 'Zero risc personal',
    desc: 'Dacă pierzi, pierdem noi banii — nu tu. Singurul cost este taxa unică de challenge.',
  },
  {
    icon: Layers,
    title: 'Fotbal, baschet, tenis, MMA & altele',
    desc: 'Pariază pe toate sporturile majore. Focalizează-te pe unul sau diversifică — contul tău, strategia ta.',
  },
  {
    icon: Maximize2,
    title: 'Plăți în 24-48 ore',
    desc: 'Cere retragerea profitului și primești banii în 1-2 zile lucrătoare. Fără birocrație, fără tergiversări.',
  },
  {
    icon: Wallet,
    title: 'Păstrezi până la 80% din profit',
    desc: 'Odată finanțat, fiecare pick câștigător aduce bani reali în buzunarul tău — până la 80% din profit.',
  },
  {
    icon: Users,
    title: 'Comunitate & suport',
    desc: 'Intră pe Discord, accesează calculatoare și primește ajutor de la oameni reali — nu boți.',
  },
];

// Verified-live Unsplash silhouette of an athlete; non-trademark, generic action shot.
const PLAYER_IMG = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80';
const PLAYER_IMG_FALLBACK = 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80';

export default function DeCeSuperFundedSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24" style={{ background: '#0a0a0a' }}>
      {/* Decorative player silhouette on the right edge — desktop only */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none select-none"
        aria-hidden="true">
        <img
          src={PLAYER_IMG}
          alt=""
          className="absolute right-0 top-0 h-full w-full object-cover object-left"
          style={{ opacity: 0.22, filter: 'grayscale(0.3)' }}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== PLAYER_IMG_FALLBACK) img.src = PLAYER_IMG_FALLBACK;
          }}
        />
        {/* Soft gradient mask so the photo fades into the dark background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to left, transparent 0%, rgba(10,10,10,0.6) 50%, #0a0a0a 95%)',
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-extrabold tracking-tight leading-[1.05] text-white"
            style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}>
            De ce mii de pickeri aleg<br/>
            <span style={{ color: 'var(--red, #e63946)' }}>SuperFunded</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Capitalul nostru. Pick-urile tale. Risc zero pe banii tăi.
          </p>
        </div>

        {/* 3×2 grid of feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:bg-white/[0.04]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.25)',
                }}>
                <Icon className="w-5 h-5" style={{ color: '#60a5fa' }} />
              </div>
              <h3 className="font-extrabold text-white text-lg mb-2 leading-tight">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
