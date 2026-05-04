'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALE = [
  { nume: 'Andrei M.', loc: 'Cluj-Napoca', sport: 'Fotbal', roi: '+24%', text: 'Am trecut evaluarea în 18 zile pariind exclusiv pe Premier League. Retragerea de €800 a ajuns în cont în 24 ore.', initiale: 'AM' },
  { nume: 'Cristina P.', loc: 'București', sport: 'Tenis', roi: '+31%', text: 'Ca analistă de tenis, platforma mi-a oferit capitalul de care aveam nevoie fără riscul personal. Recomand tuturor!', initiale: 'CP' },
  { nume: 'Mihai D.', loc: 'Timișoara', sport: 'Baschet', roi: '+19%', text: 'Procesul de KYC a durat 2 zile, apoi am primit contul de €10.000. Suportul răspunde în minute.', initiale: 'MD' },
  { nume: 'Radu T.', loc: 'Iași', sport: 'MMA', roi: '+42%', text: 'Cel mai bun ROI în luna UFC 300. Am retras €1.680 profit în prima săptămână ca bettor finanțat.', initiale: 'RT' },
  { nume: 'Elena V.', loc: 'Brașov', sport: 'Fotbal', roi: '+28%', text: 'Regulile sunt clare și corecte. Nu există surprize neplăcute. Exact ce căutam de ani de zile.', initiale: 'EV' },
  { nume: 'Bogdan L.', loc: 'Constanța', sport: 'Rugby', roi: '+35%', text: 'Am luat planul Elite și a meritat fiecare euro. Capitalul de €50K mi-a permis să aplic strategii pe care nu le puteam folosi cu banii proprii.', initiale: 'BL' },
];

export default function TestimonialeSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testi-card', { opacity: 0, y: 60, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 68%', toggleActions: 'play none none reverse' },
      });
      gsap.fromTo('.testi-header', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(230,57,70,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="testi-header text-center mb-16">
          <span className="text-red-500 text-sm font-bold tracking-widest uppercase">Social Proof</span>
          <h2 className="text-5xl md:text-6xl font-black text-white mt-2 mb-4">BETTORI FINANȚAȚI</h2>
          <p className="text-white/50 text-lg">Rezultate reale de la comunitatea SuperFunded</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALE.map((t, i) => (
            <div key={i} className="testi-card bg-[#111111] border border-white/8 rounded-2xl p-6 hover:border-red-500/30 hover:-translate-y-1 transition-all duration-400 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-sm shadow-lg">{t.initiale}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.nume}</div>
                    <div className="text-white/40 text-xs">{t.sport} · {t.loc}</div>
                  </div>
                </div>
                <span className="text-green-400 font-black text-xl">{t.roi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
