'use client';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Wallet, ShieldCheck, Clock, Zap, BarChart3, Globe, Trophy, Repeat2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Alege Challenge-ul',
    icon: Target,
    description: 'Selectezi capitalul (€500–€50K) și tipul de challenge. Plătești o taxă unică — fără abonamente, fără surprize.',
  },
  {
    step: '02',
    title: 'Demonstrezi Abilitățile',
    icon: TrendingUp,
    description: 'Atingi targetul de profit respectând regulile de risc. Nicio limită de timp pe planurile 2-Step.',
  },
  {
    step: '03',
    title: 'Primești Capital & Câștigi',
    icon: Wallet,
    description: 'Treci evaluarea și pariezi cu banii noștri. Păstrezi 70–80% din fiecare câștig. Simplu.',
  },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'KYC în 48h',           desc: 'Verificare rapidă de identitate. Odată aprobat, retragerile sunt disponibile imediat.' },
  { icon: Clock,       title: 'Fără Limită de Timp',  desc: 'Pe planurile 2-Step nu există deadline. Lucrezi în ritmul tău, fără presiune.' },
  { icon: Zap,         title: 'Acces Instant',         desc: 'Contul de evaluare este activ în câteva minute după plată. Zero birocrație.' },
  { icon: BarChart3,   title: 'Statistici Complete',   desc: 'Dashboard cu win rate, ROI, profit pe sport, evoluție zilnică. Control total.' },
  { icon: Globe,       title: '9 Sporturi',            desc: 'Fotbal, tenis, baschet, MMA, rugby, hochei și mai multe. Live și combinate permise.' },
  { icon: Trophy,      title: 'Split 80% Profit',      desc: 'Cea mai mare rată din industrie. Prima retragere include rambursarea taxei de evaluare.' },
  { icon: Repeat2,     title: 'Retrageri Săptămânale', desc: 'Procesăm în fiecare săptămână. Transfer bancar sau crypto — tu alegi metoda.' },
];

export default function CumFunctioneazaSection() {
  return (
    <section id="cum-functioneaza" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Cum Funcționează
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            3 pași simpli spre{' '}
            <span style={{ color: 'var(--red)' }}>capital finanțat</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            De la zero la bettor finanțat cu capital până la €50.000.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5"
            style={{ background: 'linear-gradient(90deg, var(--border), var(--red), var(--border))' }} />

          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative rounded-2xl p-7 border text-center"
              style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative z-10 mx-auto"
                style={{ background: 'white', border: '2px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <s.icon className="w-7 h-7" style={{ color: 'var(--red)' }} />
              </div>
              <div className="text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
                PASUL {s.step}
              </div>
              <h3 className="text-lg font-extrabold mb-3" style={{ color: 'var(--text)' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="border-t pt-16" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-2xl font-extrabold text-center mb-10" style={{ color: 'var(--text)' }}>
            Tot ce ai nevoie, inclus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="flex gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:border-red-200 cursor-default group"
                style={{ background: 'white', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: '#fff1f2' }}>
                  <f.icon className="w-4 h-4" style={{ color: 'var(--red)' }} />
                </div>
                <div>
                  <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>{f.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
