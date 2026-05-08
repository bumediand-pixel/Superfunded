export const metadata = { title: 'Disclaimer – SuperFunded', description: 'Disclaimer și avertizări legale ale platformei SuperFunded.' };

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Legal</span>
          </div>
          <h1 className="font-bebas leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            DISCLAIMER
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ultima actualizare: 1 Ianuarie 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>

          <div className="p-5" style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.3)' }}>
            <p className="font-bebas text-lg tracking-wider mb-2" style={{ color: 'var(--red)' }}>AVERTISMENT IMPORTANT</p>
            <p>SuperFunded NU este un operator de pariuri sportive și NU deținem o licență de gambling. Platforma noastră este un sistem de evaluare a abilităților analitice sportive. Citiți cu atenție acest disclaimer înainte de a utiliza platforma.</p>
          </div>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>1. NATURA PLATFORMEI</h2>
            <p>SuperFunded este o platformă de evaluare a abilităților de prognosticare sportivă. Utilizăm un sistem de simulare cu puncte virtuale și solduri simulate pentru a evalua capacitatea utilizatorilor de a analiza și anticipa rezultatele sportive.</p>
            <p className="mt-3"><strong style={{ color: 'var(--white-hi)' }}>NU suntem:</strong> cazino, casă de pariuri, operator de jocuri de noroc sau intermediar de pariuri sportive.</p>
            <p className="mt-3"><strong style={{ color: 'var(--white-hi)' }}>NU plasăm, NU procesăm și NU acceptăm</strong> pariuri reale pe evenimente sportive sau de altă natură.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>2. RISCURI ASOCIATE</h2>
            <p>Deși SuperFunded este o platformă de evaluare și nu o platformă de gambling, există riscuri de care trebuie să fii conștient:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Taxa de evaluare poate fi pierdută dacă nu treci evaluarea — aceasta nu este rambursabilă',
                'Performanțele trecute nu garantează performanțe viitoare',
                'Chiar și cei mai experimentați analiști sportivi pot înregistra pierderi',
                'Natura competitivă a evaluării implică un risc de eșec',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>3. JOCUL RESPONSABIL</h2>
            <p>SuperFunded promovează analiza sportivă responsabilă. Dacă simți că ai o problemă cu jocul de noroc sau cu pariurile:</p>
            <div className="mt-4 space-y-3">
              {[
                { org: 'Joc Responsabil România', desc: 'jocresponsabil.ro — resurse și ajutor pentru dependența de jocuri de noroc' },
                { org: 'Gamblers Anonymous', desc: 'gamblersanonymous.org — suport pentru dependența de gambling' },
                { org: 'ANPC România', desc: 'anpc.ro — Autoritatea Națională pentru Protecția Consumatorilor' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-3" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="font-mono text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--red)' }}>{item.org}</span>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold" style={{ color: 'var(--white-hi)' }}>Vârsta minimă pentru utilizarea platformei noastre este de 18 ani.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>4. ACURATEȚEA INFORMAȚIILOR</h2>
            <p>Informațiile furnizate pe platforma noastră sunt oferite "ca atare" și doar în scop informativ. SuperFunded nu garantează acuratețea, completitudinea sau actualitatea informațiilor referitoare la:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Cotele sportive afișate (acestea sunt orientative)',
                'Statisticile și performanțele afișate în leaderboard',
                'Orice predicții sau analize sportive publicate',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginTop: '2px', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>5. CONFORMITATE LEGALĂ</h2>
            <p>SuperFunded operează în conformitate cu legislația română aplicabilă activităților de evaluare a performanței bazate pe skill. Nu deținem și nu avem nevoie de licență de operator de jocuri de noroc conform legislației române în vigoare, deoarece activitățile noastre nu se califică ca jocuri de noroc.</p>
            <p className="mt-3">Cu toate acestea, utilizatorii din jurisdicții diferite sunt responsabili pentru verificarea conformității cu legislația locală aplicabilă înainte de a utiliza platforma noastră. SuperFunded restricționează accesul utilizatorilor din jurisdicțiile în care activitățile noastre ar putea fi considerate ilegale.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>6. LIMITAREA RĂSPUNDERII</h2>
            <p>În măsura maximă permisă de lege, SuperFunded SRL exclude orice răspundere pentru:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Pierderi financiare cauzate de decizii luate pe baza informațiilor de pe platformă',
                'Întreruperi ale serviciului sau erori tehnice',
                'Acțiuni ale terților care afectează disponibilitatea serviciului',
                'Pierderi indirecte sau consecvente de orice natură',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'rgba(255,255,255,0.3)', marginTop: '2px', flexShrink: 0 }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>7. CONTACT</h2>
            <div className="p-4 font-mono text-xs space-y-1" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              <div>SuperFunded SRL</div>
              <div>Email: support@thesuperfunded.com</div>
              <div>România</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
