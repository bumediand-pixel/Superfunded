'use client';
import { useState } from 'react';

const REGULI_CHALLENGE = [
  {
    categorie: 'TARGET PROFIT',
    icon: '📈',
    reguli: [
      {
        titlu: 'Target Faza 1 (2-Step)',
        val: '30%',
        desc: 'Trebuie să atingi un profit de minim 30% din capitalul alocat în Faza 1. Exemplu: pe un cont de €10.000, trebuie să ajungi la €13.000.',
        good: true,
      },
      {
        titlu: 'Target Faza 2 (2-Step)',
        val: '20%',
        desc: 'Trebuie să atingi un profit de minim 20% din capitalul alocat în Faza 2. Exemplu: pe un cont de €10.000, trebuie să ajungi la €12.000.',
        good: true,
      },
      {
        titlu: 'Target 1-Step',
        val: '40%',
        desc: 'Un singur target mai exigent de 40%. Exemplu: pe un cont de €10.000, trebuie să ajungi la €14.000.',
        good: true,
      },
    ],
  },
  {
    categorie: 'LIMITE DE RISC',
    icon: '⚠️',
    reguli: [
      {
        titlu: 'Pierdere Zilnică Maximă',
        val: '5%',
        desc: 'Nu poți pierde mai mult de 5% din soldul contului tău într-o singură zi calendaristică. Ziua se resetează la 00:00 UTC. Dacă atingi această limită, nu mai poți plasa pariuri până a doua zi.',
        good: false,
      },
      {
        titlu: 'Drawdown Maxim Total',
        val: '8%',
        desc: 'Nu poți pierde mai mult de 8% din capitalul inițial al contului (niciodată). Aceasta este limita absolută. Dacă soldul scade cu 8% față de capitalul de start, evaluarea se încheie definitiv.',
        good: false,
      },
    ],
  },
  {
    categorie: 'TIMP & PARIURI',
    icon: '⏱️',
    reguli: [
      {
        titlu: 'Limită de Timp (2-Step)',
        val: '∞',
        desc: 'Nu există limită de timp pentru 2-Step Challenge. Poți lua atât timp cât ai nevoie pentru a atinge targetul — 1 lună, 3 luni sau mai mult. Singurul timer este propria ta strategie.',
        good: true,
      },
      {
        titlu: 'Limită de Timp (1-Step)',
        val: '30 zile',
        desc: 'La 1-Step Challenge există o limită de 30 de zile calendaristice pentru a atinge targetul de 40%. Dacă nu atingi targetul în acest interval, evaluarea se încheie.',
        good: false,
      },
      {
        titlu: 'Pariuri Minime',
        val: 'Nicio cerință',
        desc: 'Nu există o cerință de număr minim de pariuri. Poți plasa 5 pariuri sau 500 — important este să respecți regulile de risc și să atingi targetul.',
        good: true,
      },
    ],
  },
  {
    categorie: 'SPORTURI & PIEȚE',
    icon: '⚽',
    reguli: [
      {
        titlu: 'Sporturi Permise',
        val: 'Toate',
        desc: 'Fotbal, Baschet, Tenis, MMA/UFC, Rugby, Hochei pe gheață, Volei, Cricket, Esports și altele. Lista completă este disponibilă în platformă.',
        good: true,
      },
      {
        titlu: 'Piețe Permise',
        val: 'Toate',
        desc: 'Rezultat final (1X2), Scor corect, Over/Under, Handicap asiatic, Ambele marchează, Câștigătoare set, Handicap și multe altele. Nu există restricții de piețe.',
        good: true,
      },
      {
        titlu: 'Pariuri Live (In-Play)',
        val: 'Permise',
        desc: 'Poți plasa pariuri live pe evenimentele disponibile. Cotele live sunt furnizate în timp real prin platforma noastră.',
        good: true,
      },
      {
        titlu: 'Sisteme & Combinate',
        val: 'Permise',
        desc: 'Poți folosi pariuri simple, combinate (acumulatoare) sau sisteme. Nu există restricții la strategia de pariere — alege ce funcționează pentru tine.',
        good: true,
      },
    ],
  },
  {
    categorie: 'COMPORTAMENT INTERZIS',
    icon: '🚫',
    reguli: [
      {
        titlu: 'Conturi Multiple',
        val: 'INTERZIS',
        desc: 'Un singur cont per persoană fizică. Orice tentativă de a crea conturi multiple va duce la suspendarea permanentă a tuturor conturilor fără rambursare.',
        good: false,
      },
      {
        titlu: 'Arbitraj / Sure Bets',
        val: 'INTERZIS',
        desc: 'Strategiile de arbitraj sistematic (sure bets) între conturi proprii sau cu parteneri externi sunt interzise. Detectarea duce la suspendare imediată.',
        good: false,
      },
      {
        titlu: 'Exploatarea Erorilor',
        val: 'INTERZIS',
        desc: 'Exploatarea intenționată a erorilor de sistem sau cotelor greșite (obvious errors) este interzisă. SuperFunded își rezervă dreptul de a anula pariurile plasate în astfel de condiții.',
        good: false,
      },
      {
        titlu: 'Partajarea Contului',
        val: 'INTERZIS',
        desc: 'Contul tău este strict personal. Partajarea credențialelor sau accesul terților la contul tău este interzis și duce la suspendare imediată.',
        good: false,
      },
    ],
  },
];

const REGULI_CONT_FINANTAT = [
  { titlu: 'Split Profit 2-Step', val: '80%', desc: 'Păstrezi 80% din profitul generat pe contul finanțat. SuperFunded primește 20%.', good: true },
  { titlu: 'Split Profit 1-Step', val: '70%', desc: 'Păstrezi 70% din profitul generat pe contul finanțat. SuperFunded primește 30%.', good: true },
  { titlu: 'Retrageri', val: 'Săptămânal', desc: 'Poți solicita retrageri săptămânal. Plățile sunt procesate în 24-48 ore lucrătoare.', good: true },
  { titlu: 'Rambursare taxă', val: 'Prima retragere', desc: 'Prima ta retragere include automat rambursarea integrală a taxei de evaluare plătite.', good: true },
  { titlu: 'Drawdown cont finanțat', val: '8%', desc: 'Aceleași reguli de risc se aplică și pe contul finanțat. Drawdown maxim 8% din capitalul inițial.', good: false },
  { titlu: 'Limita zilnică', val: '5%', desc: 'Aceeași limită zilnică de 5% se aplică și pe contul finanțat.', good: false },
];

export default function ReguliPage() {
  const [activeTab, setActiveTab] = useState<'challenge' | 'finantat'>('challenge');

  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-semibold text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Regulament</span>
          </div>
          <h1 className="font-extrabold tracking-tight leading-none mb-6" style={{ fontSize: 'clamp(52px, 9vw, 110px)', letterSpacing: '0.03em' }}>
            REGULILE<br/>PLATFORMEI
          </h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-muted, #64748b)' }}>
            Cunoaște regulile înainte să începi. Un bettor disciplinat care respectă regulile de risc ajunge finanțat — unul care le ignoră, nu.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-0 border mb-12 self-start w-fit" style={{ borderColor: 'var(--border, #e2e8f0)' }}>
          <button onClick={() => setActiveTab('challenge')}
            className="font-semibold text-xs tracking-[0.16em] uppercase px-7 py-3 transition-all duration-300"
            style={{ background: activeTab === 'challenge' ? 'var(--red)' : 'transparent', color: activeTab === 'challenge' ? 'white' : 'var(--text-muted, #64748b)' }}>
            Evaluare
          </button>
          <button onClick={() => setActiveTab('finantat')}
            className="font-semibold text-xs tracking-[0.16em] uppercase px-7 py-3 transition-all duration-300"
            style={{ background: activeTab === 'finantat' ? 'var(--red)' : 'transparent', color: activeTab === 'finantat' ? 'white' : 'var(--text-muted, #64748b)', borderLeft: '1px solid var(--border, #e2e8f0)' }}>
            Cont Finanțat
          </button>
        </div>

        {activeTab === 'challenge' ? (
          <div className="space-y-12">
            {REGULI_CHALLENGE.map((cat) => (
              <div key={cat.categorie}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="font-extrabold tracking-tight text-2xl tracking-wider" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.06em' }}>{cat.categorie}</h2>
                  <div className="flex-1 h-px" style={{ background: 'var(--border, #e2e8f0)' }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.reguli.map((r) => (
                    <div key={r.titlu} className="p-5 relative"
                      style={{
                        background: '#ffffff',
                        border: `1px solid ${r.good ? 'rgba(34,197,94,0.12)' : r.val === 'INTERZIS' ? 'rgba(230,57,70,0.2)' : 'var(--border, #e2e8f0)'}`,
                      }}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-semibold text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted, #64748b)' }}>{r.titlu}</span>
                        <span className="font-extrabold tracking-tight text-xl ml-3 shrink-0"
                          style={{ color: r.val === 'INTERZIS' ? 'var(--red)' : r.val === 'Permise' || r.val === 'Toate' || r.val === 'Nicio cerință' ? '#22c55e' : r.good ? '#22c55e' : 'var(--text, #0f172a)', letterSpacing: '0.04em' }}>
                          {r.val}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted, #64748b)' }}>{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REGULI_CONT_FINANTAT.map((r) => (
              <div key={r.titlu} className="p-5 relative"
                style={{
                  background: '#ffffff',
                  border: `1px solid ${r.good ? 'rgba(201,168,76,0.2)' : 'var(--border, #e2e8f0)'}`,
                }}>
                {r.good && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />}
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted, #64748b)' }}>{r.titlu}</span>
                  <span className="font-extrabold tracking-tight text-xl ml-3 shrink-0"
                    style={{ color: r.good ? 'var(--gold)' : 'var(--text, #0f172a)', letterSpacing: '0.04em' }}>
                    {r.val}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted, #64748b)' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Violations summary */}
        <div className="mt-16 p-6" style={{ background: 'rgba(230,57,70,0.04)', border: '1px solid rgba(230,57,70,0.15)' }}>
          <div className="font-extrabold tracking-tight text-xl tracking-wider mb-4" style={{ color: 'var(--red)', letterSpacing: '0.06em' }}>CE SE ÎNTÂMPLĂ LA ÎNCĂLCAREA REGULILOR</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>
            <div>
              <div className="font-semibold mb-2" style={{ color: 'var(--text, #0f172a)' }}>Depășire limită risc</div>
              <p>Evaluarea se încheie automat. Poți reîncerca cu o reducere de 20% la taxa inițială.</p>
            </div>
            <div>
              <div className="font-semibold mb-2" style={{ color: 'var(--text, #0f172a)' }}>Comportament interzis</div>
              <p>Suspendare permanentă a contului, fără drept de rambursare sau reîncercare.</p>
            </div>
            <div>
              <div className="font-semibold mb-2" style={{ color: 'var(--text, #0f172a)' }}>Neatingere target la timp (1-Step)</div>
              <p>Evaluarea expiră. Poți reîncerca cu o reducere de 20% la taxa inițială.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a href="/planuri"
            className="inline-block font-bold text-xs tracking-[0.14em] uppercase px-10 py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(230,57,70,0.4)]"
            style={{ background: 'var(--red)', color: 'white', clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
            Acceptă Provocarea
          </a>
        </div>

      </div>
    </div>
  );
}
