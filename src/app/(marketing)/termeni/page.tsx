export const metadata = { title: 'Termeni & Condiții – SuperFunded', description: 'Termenii și condițiile platformei SuperFunded.' };

export default function TermeniPage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Legal</span>
          </div>
          <h1 className="font-bebas leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            TERMENI &<br/>CONDIȚII
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ultima actualizare: 1 Ianuarie 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>1. ACCEPTAREA TERMENILOR</h2>
            <p>Prin accesarea sau utilizarea platformei SuperFunded (thesuperfunded.com), ești de acord să respecți și să fii legat de acești Termeni și Condiții. Dacă nu ești de acord cu oricare parte a acestor termeni, nu poți accesa serviciul.</p>
            <p className="mt-3">SuperFunded este operat de SuperFunded SRL, o companie înregistrată în România. Acești termeni se aplică tuturor vizitatorilor, utilizatorilor și oricărei alte persoane care accesează sau utilizează Serviciul.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>2. DESCRIEREA SERVICIULUI</h2>
            <p>SuperFunded este o platformă de evaluare a abilităților de betting bazată pe performanță. Nu suntem un cazino, casă de pariuri sau operator de jocuri de noroc și nu plasăm, procesăm sau acceptăm pariuri reale.</p>
            <p className="mt-3">Platforma noastră utilizează un sistem de evaluare cu puncte virtuale și solduri simulate pentru a evalua abilitățile analitice ale utilizatorilor în domeniul sportiv. Utilizatorii care demonstrează abilități constante de prognosticare sportivă prin programul nostru de evaluare pot primi acces la un cont finanțat și pot câștiga bani reali din profiturile generate.</p>
            <p className="mt-3">Taxa plătită pentru participarea la programul nostru de evaluare reprezintă o taxă de acces la program și nu constituie un pariu sau o miză de joc.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>3. ELIGIBILITATE</h2>
            <p>Pentru a utiliza Serviciile noastre, trebuie:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Să ai cel puțin 18 ani',
                'Să nu fii rezident dintr-o țară din lista țărilor restricționate',
                'Să nu fi fost anterior suspendat sau exclus de pe platforma noastră',
                'Să furnizezi informații de înregistrare corecte și complete',
                'Să deții un singur cont pe platformă',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>4. CONTUL DE UTILIZATOR</h2>
            <p>Ești responsabil pentru menținerea confidențialității contului și a parolei tale. Ești de acord să ne notifici imediat cu privire la orice utilizare neautorizată a contului tău. SuperFunded nu va fi răspunzătoare pentru nicio pierdere care rezultă din utilizarea neautorizată a contului tău.</p>
            <p className="mt-3">Este strict interzisă deținerea mai multor conturi. Dacă detectăm conturi multiple asociate aceleiași persoane, toate conturile vor fi suspendate permanent fără rambursare.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>5. PROGRAMUL DE EVALUARE</h2>
            <p>SuperFunded oferă două tipuri de programe de evaluare:</p>
            <div className="mt-4 space-y-4">
              <div className="p-4" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-bebas text-lg tracking-wider mb-2" style={{ color: 'var(--white-hi)' }}>1-STEP CHALLENGE</div>
                <p>Un singur pas de evaluare cu un target de profit de 40%. Limită de timp de 30 de zile. Split profit de 70% odată finanțat. Limită zilnică de pierdere 5%, drawdown maxim 8%.</p>
              </div>
              <div className="p-4" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-bebas text-lg tracking-wider mb-2" style={{ color: 'var(--white-hi)' }}>2-STEP CHALLENGE</div>
                <p>Două faze de evaluare: Faza 1 cu target de 30%, Faza 2 cu target de 20%. Fără limită de timp. Split profit de 80% odată finanțat. Limită zilnică de pierdere 5%, drawdown maxim 8%.</p>
              </div>
            </div>
            <p className="mt-4">SuperFunded își rezervă dreptul de a modifica parametrii programelor de evaluare cu o notificare prealabilă de 7 zile.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>6. TAXE ȘI PLĂȚI</h2>
            <p>Taxa de evaluare este o plată unică, nerambursabilă, pentru accesul la programul nostru de evaluare. Toate prețurile sunt exprimate în EUR. Plățile sunt procesate prin Stripe.</p>
            <p className="mt-3">Prima retragere din contul finanțat include automat rambursarea integrală a taxei de evaluare inițiale. Retragerile ulterioare vor fi procesate conform split-ului de profit agreat (70% sau 80%).</p>
            <p className="mt-3">SuperFunded nu percepe taxe lunare, abonamente sau alte costuri recurente dincolo de taxa inițială de evaluare.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>7. REGULILE CONTULUI FINANȚAT</h2>
            <p>Odată ce primești un cont finanțat, trebuie să respecți următoarele reguli în permanență:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Limita zilnică de pierdere: 5% din soldul contului',
                'Drawdown maxim: 8% din capitalul inițial al contului finanțat',
                'Nu poți partaja sau vinde accesul la contul tău',
                'Nu poți folosi sisteme automatizate sau scripturi pentru plasarea pariurilor',
                'Nu poți angaja nicio formă de manipulare a cotelor sau coordonare cu alți utilizatori',
                'Retrageri procesate săptămânal, cu o întârziere de 24-48 ore lucrătoare',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">Încălcarea oricăreia dintre aceste reguli va duce la suspendarea imediată a contului finanțat fără drept de rambursare.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>8. VERIFICAREA IDENTITĂȚII (KYC)</h2>
            <p>Înainte de prima retragere, toți utilizatorii trebuie să finalizeze procesul de verificare a identității (KYC – Know Your Customer). Procesul include:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Verificarea actului de identitate valabil (CI/Pașaport)',
                'Dovada de rezidență (factură utilități sau extras de cont, max. 3 luni)',
                'Selfie de verificare liveness',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">Procesul KYC este obligatoriu și nu poate fi omis. SuperFunded își rezervă dreptul de a refuza retragerea fondurilor dacă verificarea KYC nu este completată satisfăcător.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>9. PROPRIETATE INTELECTUALĂ</h2>
            <p>Serviciul și conținutul său original, funcționalitățile și designul sunt și vor rămâne proprietatea exclusivă a SuperFunded SRL. Serviciul nostru este protejat de legile drepturilor de autor, mărcilor comerciale și alte legi din România și din alte țări.</p>
            <p className="mt-3">Nu poți reproduce, distribui, modifica, crea opere derivate, afișa public, executa public, republica, descărca, stoca sau transmite niciun material de pe platforma noastră, cu excepția cazului în care este permis în mod expres.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>10. LIMITAREA RĂSPUNDERII</h2>
            <p>În nicio circumstanță SuperFunded SRL, directorii, angajații, partenerii, agenții, furnizorii sau afiliații săi nu vor fi răspunzători pentru daune indirecte, incidentale, speciale, consecvente sau punitive, inclusiv pierderea de profit, date, utilizare, bunăvoință sau alte pierderi intangibile.</p>
            <p className="mt-3">Răspunderea noastră maximă față de tine pentru orice daune nu va depăși suma plătită de tine în ultimele 6 luni pentru Serviciu sau 100 EUR, oricare este mai mare.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>11. LEGEA APLICABILĂ</h2>
            <p>Acești Termeni vor fi guvernați și interpretați în conformitate cu legile din România, fără a ține cont de prevederile referitoare la conflictul de legi. Orice dispute vor fi rezolvate în instanțele competente din România.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>12. MODIFICĂRI</h2>
            <p>Ne rezervăm dreptul de a modifica sau înlocui acești termeni în orice moment. Dacă o revizuire este materială, vom încerca să furnizăm o notificare de cel puțin 30 de zile înainte ca noii termeni să intre în vigoare. Continuarea utilizării Serviciului după intrarea în vigoare a revizuirilor constituie acceptul tău față de noii termeni.</p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>13. CONTACT</h2>
            <p>Dacă ai întrebări despre acești Termeni și Condiții, contactează-ne la:</p>
            <div className="mt-4 p-4 font-mono text-xs space-y-1" style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
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
