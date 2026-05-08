export const metadata = { title: 'Politică de Rambursare – SuperFunded', description: 'Politica de rambursare a platformei SuperFunded.' };

export default function RamburssarePage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Legal</span>
          </div>
          <h1 className="font-bebas leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            POLITICĂ DE<br/>RAMBURSARE
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ultima actualizare: 1 Ianuarie 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>

          <div className="p-5" style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)' }}>
            <p className="font-semibold" style={{ color: 'var(--white-hi)' }}>Rezumat important:</p>
            <p className="mt-2">Taxa de evaluare nu este rambursabilă — dar este recuperabilă. Prima ta retragere din contul finanțat include automat suma taxei de challenge plătite. Dacă ești finanțat, îți recuperezi investiția integral.</p>
          </div>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>1. TAXA DE EVALUARE — POLITICA GENERALĂ</h2>
            <p>Prin achiziționarea unui Challenge SuperFunded, ești de acord că taxa plătită este <strong style={{ color: 'var(--white-hi)' }}>nerambursabilă</strong> în circumstanțe normale.</p>
            <p className="mt-3">Motivul acestei politici: taxa reprezintă accesul imediat la platforma noastră de evaluare și la resursele digitale asociate (cont de simulare, dashboard, instrumente de analiză). Accesul la aceste resurse digitale este furnizat instant după plată.</p>
            <p className="mt-3">Această politică este clară și transparentă — toți utilizatorii acceptă explicit acești termeni înainte de finalizarea plății.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>2. RECUPERAREA TAXEI PRIN PRIMA RETRAGERE</h2>
            <p>Deși taxa nu este rambursabilă direct, sistemul nostru este conceput astfel încât să-ți recuperezi investiția imediat ce ești finanțat:</p>
            <ul className="list-none mt-4 space-y-3">
              <li className="flex items-start gap-3 p-3" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>01</span>
                <span>Treci evaluarea și primești contul finanțat</span>
              </li>
              <li className="flex items-start gap-3 p-3" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>02</span>
                <span>Soliciți prima retragere din contul finanțat</span>
              </li>
              <li className="flex items-start gap-3 p-3" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>03</span>
                <span>Prima retragere include automat suma taxei de challenge plătite + profitul tău</span>
              </li>
            </ul>
            <p className="mt-4">Exemplu: ai plătit €139 pentru un challenge de €10.000 (2-Step) și ai generat €2.000 profit. Prima ta retragere va fi: €139 (rambursare taxă) + €1.600 (80% din €2.000 profit) = <strong style={{ color: 'var(--white-hi)' }}>€1.739</strong>.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>3. EXCEPȚII — CÂND PROCESĂM RAMBURSĂRI</h2>
            <p>Procesăm rambursări complete sau parțiale doar în următoarele situații:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Eroare tehnică dovedită din partea platformei noastre care a împiedicat accesul la cont',
                'Plată duplicată (aceeași tranzacție procesată de două ori)',
                'Cont blocat din motive neimputabile utilizatorului, confirmat de echipa tehnică',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">Pentru a solicita o rambursare în baza excepțiilor de mai sus, contactează echipa de suport la <span style={{ color: 'var(--white-hi)' }}>support@thesuperfunded.com</span> în termen de 7 zile de la data tranzacției, furnizând dovezile relevante.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>4. SITUAȚII CARE NU BENEFICIAZĂ DE RAMBURSARE</h2>
            <ul className="list-none space-y-2">
              {[
                'Depășirea limitelor de risc (drawdown maxim sau limită zilnică) și pierderea evaluării',
                'Neatingerea targetului de profit în termenul limită (1-Step: 30 zile)',
                'Suspendarea contului pentru încălcarea termenilor (conturi multiple, fraudă, etc.)',
                'Schimbarea deciziei după accesarea platformei',
                'Imposibilitatea de a finaliza evaluarea din motive personale',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginTop: '2px', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>5. REDUCERE LA REÎNCERCARE</h2>
            <p>Dacă nu reușești evaluarea, poți reîncerca cu o <strong style={{ color: 'var(--white-hi)' }}>reducere de 20%</strong> față de taxa originală. Această reducere se aplică automat la achiziția unui nou challenge de același tip și dimensiune.</p>
            <p className="mt-3">Reducerea la reîncercare nu este cumulabilă cu alte promoții și se aplică o singură dată per tip de challenge.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>6. PROCESUL DE RAMBURSARE</h2>
            <p>Dacă evaluăm că situația ta se califică pentru o rambursare:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Rambursarea va fi procesată în 5-10 zile lucrătoare',
                'Suma va fi returnată pe același card/metodă de plată utilizată la achiziție',
                'Vei primi o confirmare prin email odată ce rambursarea este procesată',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>7. CONTACT PENTRU RAMBURSĂRI</h2>
            <div className="p-4 font-mono text-xs space-y-1" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              <div>Email: support@thesuperfunded.com</div>
              <div>Subiect email: [RAMBURSARE] + ID tranzacție</div>
              <div>Timp răspuns: 24-48 ore lucrătoare</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
