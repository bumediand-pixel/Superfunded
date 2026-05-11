'use client';
import { motion } from 'framer-motion';

const TESTIMONIALE = [
  { nume: 'Andrei M.', loc: 'Cluj-Napoca', sport: 'Fotbal', roi: '+24%', text: 'Am trecut evaluarea în 18 zile pariind exclusiv pe Premier League. Retragerea de €800 a ajuns în cont în 24 ore.', initiale: 'AM' },
  { nume: 'Cristina P.', loc: 'București', sport: 'Tenis', roi: '+31%', text: 'Ca analistă de tenis, platforma mi-a oferit capitalul de care aveam nevoie fără riscul personal. Recomand tuturor!', initiale: 'CP' },
  { nume: 'Mihai D.', loc: 'Timișoara', sport: 'Baschet', roi: '+19%', text: 'Procesul de KYC a durat 2 zile, apoi am primit contul de €10.000. Suportul răspunde în minute.', initiale: 'MD' },
  { nume: 'Radu T.', loc: 'Iași', sport: 'MMA', roi: '+42%', text: 'Cel mai bun ROI în luna UFC 300. Am retras €1.680 profit în prima săptămână ca picker finanțat.', initiale: 'RT' },
  { nume: 'Elena V.', loc: 'Brașov', sport: 'Fotbal', roi: '+28%', text: 'Regulile sunt clare și corecte. Nu există surprize neplăcute. Exact ce căutam de ani de zile.', initiale: 'EV' },
  { nume: 'Bogdan L.', loc: 'Constanța', sport: 'Rugby', roi: '+35%', text: 'Am luat planul Elite și a meritat fiecare euro. Capitalul de €50K mi-a permis să aplic strategii noi.', initiale: 'BL' },
];

export default function TestimonialeSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Testimoniale
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Pickeri finanțați reali
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Rezultate reale de la comunitatea SuperFunded
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALE.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'white', borderColor: 'var(--border)' }}>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="#f59e0b" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: 'var(--red)' }}>
                    {t.initiale}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{t.nume}</div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t.sport} · {t.loc}</div>
                  </div>
                </div>
                <span className="text-lg font-extrabold" style={{ color: '#22c55e' }}>{t.roi}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
