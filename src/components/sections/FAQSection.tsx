'use client';
import { useState } from 'react';

const FAQ = [
  {
    q: 'Ce este SuperFunded?',
    a: 'SuperFunded este o platformă de evaluare a abilităților de betting bazată pe performanță. Nu suntem un cazino, casă de pariuri sau operator de jocuri de noroc și nu plasăm, procesăm sau acceptăm pariuri reale. Platforma noastră folosește puncte virtuale și solduri simulate pentru evaluare. Utilizatorii care demonstrează abilități constante primesc acces la un cont finanțat și câștigă real din profiturile generate.',
  },
  {
    q: 'Cum funcționează procesul de evaluare?',
    a: 'Există două tipuri de challenge: 1-Step (un singur pas, target de 40% profit) și 2-Step (două faze: 30% în Faza 1, 20% în Faza 2). Odată ce atingi targetul respectând regulile de risc, primești contul finanțat și începi să câștigi real.',
  },
  {
    q: 'Care este diferența dintre 1-Step și 2-Step?',
    a: '1-Step Challenge: un singur target de 40% profit, split de 70% odată finanțat. Mai rapid, dar target mai mare.\n\n2-Step Challenge: două faze consecutive (30% + 20%), split de până la 80% odată finanțat. Mai mult timp de evaluare, dar condiții mai blânde și split mai bun.',
  },
  {
    q: 'Ce sporturi sunt disponibile?',
    a: 'Disponibile acum: Fotbal, Baschet, Tenis, MMA/UFC, Rugby, Hochei.\n\nÎn curând: Volei, Cricket, Badminton, Baseball, Esports.',
  },
  {
    q: 'Care sunt regulile de risc?',
    a: 'Limita de pierdere zilnică: 5% din soldul contului. Limita de pierdere totală (drawdown maxim): 8% din capitalul inițial. Dacă depășești oricare dintre aceste limite, evaluarea se încheie. Poți reîncerca cu o reducere de 20% la taxa inițială.',
  },
  {
    q: 'Există limită de timp pentru evaluare?',
    a: 'Nu există limită de timp — poți lua atât timp cât ai nevoie pentru a atinge targetul de profit. Singurul termen limită este propria ta strategie. Totuși, conform condițiilor 1-Step, trebuie să atingi targetul în 30 de zile.',
  },
  {
    q: 'Cum și când primesc plățile?',
    a: 'Retragerile sunt procesate în 24-48 ore lucrătoare. Prima retragere include și rambursarea integrală a taxei de challenge. Plata se face via transfer bancar sau crypto (USDT/BTC). Nu există perioadă minimă de așteptare după prima retragere.',
  },
  {
    q: 'Taxa de challenge este rambursabilă?',
    a: 'Taxa de challenge nu este rambursabilă în circumstanțe normale — toți banii plătiți sunt finali conform Politicii de Rambursare. Excepție: prima retragere din contul finanțat include automat suma taxei de challenge, deci practic îți recuperezi investiția imediat ce ești finanțat.',
  },
  {
    q: 'Este necesar KYC (verificare identitate)?',
    a: 'Da. Înainte de prima retragere, toți utilizatorii trebuie să completeze procesul KYC (Know Your Customer) conform reglementărilor anti-spălare bani. Procesul durează 24-48 ore și necesită un act de identitate valabil + dovadă de rezidență.',
  },
  {
    q: 'Pot deține mai multe conturi?',
    a: 'Nu. Politica SuperFunded permite strict un singur cont per persoană. Deținerea de conturi multiple, partajarea contului sau orice formă de manipulare coordonată duce la suspendare permanentă.',
  },
  {
    q: 'Ce se întâmplă dacă pierd contul finanțat?',
    a: 'Dacă depășești limitele de drawdown pe un cont finanțat, contul este dezactivat. Poți achiziționa un nou challenge cu o reducere de 20% față de taxa originală. Pierderile din contul finanțat nu te afectează personal — pariezi cu capitalul nostru, nu al tău.',
  },
  {
    q: 'SuperFunded este legal în România?',
    a: 'SuperFunded operează ca platformă de evaluare a abilităților, nu ca operator de pariuri. Nu plasăm pariuri reale și nu deținem licență de gambling — nu avem nevoie. Activitățile noastre se încadrează în categoria evaluărilor de performanță bazate pe skill. Te sfătuim să verifici legislația locală aplicabilă din jurisdicția ta.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 overflow-hidden" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Întrebări Frecvente</span>
          </div>
          <h2 className="font-bebas leading-none" style={{ fontSize: 'clamp(52px, 8vw, 100px)', letterSpacing: '0.03em', color: 'var(--white-hi)' }}>
            TOTUL DESPRE<br/>SUPERFUNDED
          </h2>
        </div>

        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="group border transition-all duration-300"
              style={{
                borderColor: open === i ? 'rgba(230,57,70,0.35)' : 'rgba(255,255,255,0.06)',
                background: open === i ? 'rgba(230,57,70,0.04)' : 'var(--black-2)',
              }}>
              <button className="w-full text-left px-6 py-5 flex items-center justify-between gap-6"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-jakarta font-semibold text-sm md:text-base leading-snug" style={{ color: open === i ? 'var(--white-hi)' : 'rgba(255,255,255,0.75)' }}>
                  {item.q}
                </span>
                <span className="font-mono text-lg shrink-0 transition-transform duration-300"
                  style={{ color: 'var(--red)', transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 border-t" style={{ borderColor: 'rgba(230,57,70,0.12)' }}>
                  <p className="text-sm leading-relaxed pt-4 whitespace-pre-line" style={{ color: 'var(--white-mid)' }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 px-6 py-5 border flex items-center justify-between flex-wrap gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--black-2)' }}>
          <div>
            <div className="font-bebas tracking-widest text-lg mb-1" style={{ color: 'var(--white-hi)' }}>MAI AI ÎNTREBĂRI?</div>
            <div className="font-mono text-xs" style={{ color: 'var(--white-mid)' }}>Răspundem în 24-48h lucrătoare</div>
          </div>
          <a href="mailto:support@superfunded.ro"
            className="font-bold text-xs tracking-[0.14em] uppercase px-6 py-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,57,70,0.4)]"
            style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
            Contactează-ne
          </a>
        </div>
      </div>
    </section>
  );
}
