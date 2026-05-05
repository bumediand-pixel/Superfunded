'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = [
  { q: 'Ce este SuperFunded?', a: 'SuperFunded este o platformă de evaluare a abilităților de betting bazată pe performanță. Nu suntem un cazino sau casă de pariuri. Platforma folosește puncte virtuale și solduri simulate pentru evaluare. Utilizatorii care demonstrează abilități constante primesc acces la un cont finanțat și câștigă real din profiturile generate.' },
  { q: 'Cum funcționează procesul de evaluare?', a: 'Există două tipuri de challenge: 1-Step (un singur pas, target de 40% profit) și 2-Step (două faze: 30% în Faza 1, 20% în Faza 2). Odată ce atingi targetul respectând regulile de risc, primești contul finanțat și începi să câștigi real.' },
  { q: 'Care este diferența dintre 1-Step și 2-Step?', a: '1-Step Challenge: un singur target de 40% profit, split de 70% odată finanțat. Mai rapid, dar target mai mare.\n\n2-Step Challenge: două faze consecutive (30% + 20%), split de până la 80% odată finanțat. Mai mult timp de evaluare, dar condiții mai blânde și split mai bun.' },
  { q: 'Ce sporturi sunt disponibile?', a: 'Disponibile acum: Fotbal, Baschet, Tenis, MMA/UFC, Rugby, Hochei.\n\nÎn curând: Volei, Cricket, Badminton, Baseball, Esports.' },
  { q: 'Care sunt regulile de risc?', a: 'Limita de pierdere zilnică: 5% din soldul contului. Limita de pierdere totală (drawdown maxim): 8% din capitalul inițial. Dacă depășești oricare dintre aceste limite, evaluarea se încheie. Poți reîncerca cu o reducere de 20% la taxa inițială.' },
  { q: 'Există limită de timp pentru evaluare?', a: 'Pe planurile 2-Step nu există limită de timp — poți lua atât timp cât ai nevoie. Pe planurile 1-Step trebuie să atingi targetul în 30 de zile.' },
  { q: 'Cum și când primesc plățile?', a: 'Retragerile sunt procesate în 24-48 ore lucrătoare. Prima retragere include și rambursarea integrală a taxei de challenge. Plata se face via transfer bancar sau crypto (USDT/BTC).' },
  { q: 'Este necesar KYC?', a: 'Da. Înainte de prima retragere, toți utilizatorii trebuie să completeze procesul KYC (Know Your Customer). Procesul durează 24-48 ore și necesită un act de identitate valabil + dovadă de rezidență.' },
  { q: 'SuperFunded este legal în România?', a: 'SuperFunded operează ca platformă de evaluare a abilităților, nu ca operator de pariuri. Nu plasăm pariuri reale și nu deținem licență de gambling. Activitățile noastre se încadrează în categoria evaluărilor de performanță bazate pe skill.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Întrebări Frecvente
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            Ai întrebări?
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i}
              className="rounded-2xl border overflow-hidden transition-all duration-200"
              style={{
                background: 'white',
                borderColor: open === i ? 'var(--red)' : 'var(--border)',
                boxShadow: open === i ? '0 4px 16px rgba(230,57,70,0.08)' : 'none',
              }}>
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-bold leading-snug" style={{ color: 'var(--text)' }}>
                  {item.q}
                </span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-300"
                  style={{ color: 'var(--red)', transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm leading-relaxed pt-4 whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border p-6 flex items-center justify-between flex-wrap gap-4"
          style={{ background: 'white', borderColor: 'var(--border)' }}>
          <div>
            <div className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Mai ai întrebări?</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Răspundem în 24-48h lucrătoare</div>
          </div>
          <a href="mailto:support@superfunded.ro"
            className="font-bold text-sm px-6 py-3 rounded-xl text-white transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--red)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c0202d'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--red)'}>
            Contactează-ne
          </a>
        </div>
      </div>
    </section>
  );
}
