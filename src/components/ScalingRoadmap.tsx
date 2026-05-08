import { ArrowRight, TrendingUp } from 'lucide-react';

const TIERS = [
  { label: '€500',    desc: 'Starter',   subtle: true },
  { label: '€1.000',  desc: 'Basic',     subtle: true },
  { label: '€5.000',  desc: 'Standard',  subtle: false },
  { label: '€10.000', desc: 'Advanced',  subtle: false, popular: true },
  { label: '€25.000', desc: 'Pro',       subtle: false },
  { label: '€50.000', desc: 'Elite',     subtle: false, top: true },
];

export default function ScalingRoadmap() {
  return (
    <section className="py-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            <TrendingUp className="w-3 h-3" />
            Scaling Plan
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Crește de la €500 la €50.000
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            După 30 zile pe cont funded și 10% profit demonstrat, primești 50% credit pe upgrade. Așa ajungi la cele mai mari conturi.
          </p>
        </div>

        <div className="rounded-3xl p-6 md:p-10"
          style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.06)' }}>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2">
            {TIERS.map((t, i) => (
              <div key={t.label} className="flex items-center gap-2 md:gap-1.5">
                <div className={`flex flex-col items-center justify-center rounded-2xl px-3 md:px-4 py-3 min-w-[88px] transition-all ${t.popular ? 'scale-110' : ''}`}
                  style={{
                    background: t.popular || t.top ? 'var(--red)' : t.subtle ? 'var(--bg-alt2)' : 'white',
                    color: t.popular || t.top ? 'white' : 'var(--text)',
                    border: t.popular || t.top ? 'none' : '1px solid var(--border)',
                    boxShadow: t.popular ? '0 8px 24px rgba(230,57,70,0.32)' : 'none',
                    opacity: t.subtle ? 0.7 : 1,
                  }}>
                  <span className="font-bebas text-2xl md:text-3xl leading-none">{t.label}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-80">{t.desc}</span>
                </div>
                {i < TIERS.length - 1 && (
                  <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                )}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-10 max-w-3xl mx-auto">
            {[
              { num: '30 zile', title: 'pe contul funded' },
              { num: '10%', title: 'profit demonstrat' },
              { num: '50%', title: 'credit pe upgrade' },
            ].map(c => (
              <div key={c.num} className="rounded-xl p-4 text-center"
                style={{ background: 'var(--bg-alt)' }}>
                <div className="font-bebas text-3xl" style={{ color: 'var(--red)' }}>{c.num}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
