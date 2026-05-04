'use client';

const SPORTURI = [
  { icon: '⚽', nume: 'Fotbal', desc: 'Premier League, La Liga, Champions League, Liga 1', disponibil: true },
  { icon: '🎾', nume: 'Tenis', desc: 'ATP, WTA, Grand Slam-uri', disponibil: true },
  { icon: '🏀', nume: 'Baschet', desc: 'NBA, Euroleague, competiții naționale', disponibil: true },
  { icon: '🏉', nume: 'Rugby', desc: 'Six Nations, Premiership, Pro14', disponibil: true },
  { icon: '🥊', nume: 'MMA / UFC', desc: 'UFC, Bellator, ONE Championship', disponibil: true },
  { icon: '🏒', nume: 'Hochei', desc: 'NHL, KHL, IIHF', disponibil: true },
  { icon: '🎮', nume: 'Esports', desc: 'CS2, League of Legends, Dota 2', disponibil: false },
  { icon: '🏈', nume: 'American Football', desc: 'NFL, NCAA', disponibil: false },
  { icon: '⚾', nume: 'Baseball', desc: 'MLB', disponibil: false },
];

export default function SporturiSection() {
  return (
    <section className="py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-red-500 text-sm font-bold tracking-widest uppercase">Piețe</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">SPORTURI DISPONIBILE</h2>
          <p className="text-white/60 text-lg">Pariuri pe cele mai populare sporturi din lume</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPORTURI.map((sport, i) => (
            <div key={i} className={`card-sport relative bg-[#141414] rounded-2xl p-6 border transition-all duration-300 cursor-default ${
              sport.disponibil ? 'border-white/10 hover:border-red-500/50 hover:-translate-y-1' : 'border-white/5 opacity-50'
            }`}>
              {!sport.disponibil && (
                <span className="absolute top-3 right-3 text-xs bg-white/10 text-white/40 px-2 py-1 rounded-full">În curând</span>
              )}
              <div className="text-4xl mb-4">{sport.icon}</div>
              <h3 className="text-xl font-black text-white mb-2">{sport.nume}</h3>
              <p className="text-white/50 text-sm">{sport.desc}</p>
              {sport.disponibil && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">Disponibil</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
