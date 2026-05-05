'use client';
import { motion } from 'framer-motion';

const SPORTURI = [
  { emoji: '⚽', nume: 'Fotbal', desc: 'Premier League, La Liga, Champions League, Liga 1', disponibil: true },
  { emoji: '🎾', nume: 'Tenis', desc: 'ATP, WTA, Grand Slam-uri', disponibil: true },
  { emoji: '🏀', nume: 'Baschet', desc: 'NBA, Euroleague, competiții naționale', disponibil: true },
  { emoji: '🏉', nume: 'Rugby', desc: 'Six Nations, Premiership, Pro14', disponibil: true },
  { emoji: '🥊', nume: 'MMA / UFC', desc: 'UFC, Bellator, ONE Championship', disponibil: true },
  { emoji: '🏒', nume: 'Hochei', desc: 'NHL, KHL, IIHF', disponibil: true },
  { emoji: '🎮', nume: 'Esports', desc: 'CS2, League of Legends, Dota 2', disponibil: false },
  { emoji: '🏈', nume: 'American Football', desc: 'NFL, NCAA', disponibil: false },
  { emoji: '⚾', nume: 'Baseball', desc: 'MLB', disponibil: false },
];

export default function SporturiSection() {
  return (
    <section id="sporturi" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Piețe disponibile
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            9 sporturi. Zero limite.
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Live, combinate, prematch — toate permise pe sporturile active.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPORTURI.map((sport, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className={`relative rounded-2xl p-5 border transition-all duration-200 cursor-default ${
                sport.disponibil ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-red-200' : 'opacity-50'
              }`}
              style={{ background: 'white', borderColor: 'var(--border)' }}>

              {!sport.disponibil && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)' }}>
                  În curând
                </span>
              )}

              <div className="text-3xl mb-3">{sport.emoji}</div>
              <h3 className="text-base font-extrabold mb-1" style={{ color: 'var(--text)' }}>{sport.nume}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{sport.desc}</p>

              {sport.disponibil && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-600">Disponibil</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
