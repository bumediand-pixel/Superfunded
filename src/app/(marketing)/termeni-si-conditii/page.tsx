import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termeni și Condiții — SuperFunded',
  description:
    'Termenii și condițiile platformei SuperFunded: jurisdicție România, ANPC/SAL-Fin, retrageri, țări restricționate, modificări cu preaviz 15 zile.',
};

const LAST_UPDATED = new Date().toLocaleDateString('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const PROHIBITED_COUNTRIES = [
  'Statele Unite ale Americii',
  'Marea Britanie',
  'Curaçao',
  'Iran',
  'Coreea de Nord',
  'Siria',
  'Cuba',
  'Crimeea, Donețk, Lugansk',
  'Myanmar',
  'Belarus',
  'Federația Rusă',
  'Orice jurisdicție din lista FATF de țări cu risc ridicat.',
];

export default function TermeniSiConditiiPage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--black-0)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <blockquote
          className="mb-10 p-4 rounded-md text-sm"
          style={{
            background: 'rgba(230,57,70,0.08)',
            border: '1px solid rgba(230,57,70,0.35)',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          <strong>DRAFT — NU CONSTITUIE CONSULTANȚĂ JURIDICĂ.</strong>{' '}
          Necesită revizuire de către avocat român specializat în iGaming.
        </blockquote>

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>
              Legal
            </span>
          </div>
          <h1
            className="font-bebas leading-none mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}
          >
            TERMENI &<br />CONDIȚII
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Ultima actualizare: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>
          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              1. PĂRȚILE
            </h2>
            <p>
              Prezentul contract se încheie între <strong style={{ color: 'var(--white-hi)' }}>SuperFunded SRL</strong>, persoană
              juridică română, sediu în România, CUI [completare], număr ordine RC [completare]
              („SuperFunded”, „noi”), și utilizatorul platformei thesuperfunded.com („tu”, „Utilizator”).
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              2. NATURA SERVICIULUI
            </h2>
            <p>
              SuperFunded oferă un program de evaluare a abilităților sportive bazat pe pariuri
              simulate. Utilizatorii care îndeplinesc criteriile de performanță primesc acces la un
              cont finanțat și pot încasa o cotă-parte din profitul generat. Taxa de evaluare
              reprezintă accesul la program și nu constituie o miză de joc de noroc.
            </p>
            <p className="mt-3">
              Calificarea juridică finală a serviciului în lumina Legii 245/2024 / OUG 77/2009 este
              în curs de clarificare cu autoritățile competente. Vom actualiza acești termeni în
              consecință.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              3. ELIGIBILITATE
            </h2>
            <ul className="list-none space-y-2">
              {[
                'Vârstă minimă 18 ani împliniți la data înregistrării.',
                'Capacitate deplină de exercițiu.',
                'Reședință într-o jurisdicție permisă (vezi secțiunea 9).',
                'Furnizare de informații exacte la KYC.',
                'Un singur cont per persoană (verificat prin CNP / fingerprint dispozitiv).',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              4. PLATĂ ȘI RETRAGERI
            </h2>
            <p>
              Taxa de evaluare se plătește anticipat prin Stripe. Toate prețurile sunt afișate în
              EUR și includ TVA dacă este cazul. Retragerile se efectuează în maxim 24-48 de ore
              lucrătoare după aprobarea cererii și finalizarea KYC.
            </p>
            <p className="mt-3">
              Pentru retrageri folosim aceeași metodă de plată ca la depunere (regula „closed-loop”
              AML). Retrageri ≥ EUR 10.000 necesită documentație suplimentară privind sursa
              fondurilor (SoF/SoW).
            </p>
            <p className="mt-3">
              Conform OUG 34/2014 art. 16(m), dreptul de retragere de 14 zile NU se aplică
              serviciilor de evaluare prestate, începute cu acordul explicit al consumatorului.
              Acordul este înregistrat la finalizarea checkout-ului.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              5. REGULI DE EVALUARE ȘI CONT FINANȚAT
            </h2>
            <ul className="list-none space-y-2">
              {[
                'Limita zilnică de pierdere: 5% din soldul contului.',
                'Drawdown maxim: 8% din capitalul inițial.',
                'Profit split: 70% (1-step) sau 80% (2-step) către utilizator.',
                'Interzisă orice formă de coluziune, manipulare cote, multi-account.',
                'Interzisă utilizarea de bots / scripturi / API neautorizate.',
                'Încălcarea regulilor → suspendare imediată, fără rambursare.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              6. KYC / AML
            </h2>
            <p>
              Înainte de orice retragere ai obligația să finalizezi KYC prin Sumsub: act de
              identitate, dovadă rezidență (max 3 luni), selfie liveness. Pentru tranzacții peste
              pragurile noastre AML (vezi politica internă), putem solicita Enhanced Due Diligence
              (sursă fonduri / sursă avere). Refuzul EDD = blocaj retragere.
            </p>
            <p className="mt-3">
              Avem obligația legală (Legea 129/2019) să raportăm tranzacții suspecte la ONPCSB și să
              cooperăm cu ANAF, ONJN și organele de cercetare penală.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              7. JOC RESPONSABIL
            </h2>
            <p>
              Promovăm jocul responsabil. Poți solicita oricând auto-excludere temporară sau
              permanentă, limite de depunere/pierdere și time-out. Detalii pe pagina{' '}
              <a href="/joc-responsabil" className="underline" style={{ color: 'var(--white-hi)' }}>
                /joc-responsabil
              </a>
              . Pentru asistență:{' '}
              <a
                href="https://jocresponsabil.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: 'var(--white-hi)' }}
              >
                jocresponsabil.ro
              </a>{' '}
              ·{' '}
              <a href="tel:0800800099" className="underline" style={{ color: 'var(--white-hi)' }}>
                0800 800 099
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              8. PROPRIETATE INTELECTUALĂ
            </h2>
            <p>
              Toate drepturile asupra platformei (cod, design, mărci, conținut) aparțin SuperFunded
              SRL sau licențiatorilor săi. Utilizatorul primește o licență neexclusivă, limitată,
              netransferabilă pentru utilizarea platformei strict conform acestor termeni.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              9. ȚĂRI RESTRICȚIONATE
            </h2>
            <p>Serviciul nu este disponibil pentru rezidenții următoarelor jurisdicții:</p>
            <ul className="list-none mt-3 space-y-2">
              {PROHIBITED_COUNTRIES.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Lista poate fi actualizată oricând în funcție de evoluția sancțiunilor internaționale
              (UE, OFAC, ONU).
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              10. RĂSPUNDERE ȘI GARANȚII
            </h2>
            <p>
              Serviciul este oferit „așa cum este”. Nu garantăm că platforma va fi disponibilă fără
              întreruperi sau lipsită de erori. Răspunderea noastră maximă față de tine este
              limitată la suma plătită în ultimele 6 luni sau echivalentul a 100 EUR, oricare este
              mai mare. Limitarea nu se aplică în caz de dol sau culpă gravă, conform Codului civil
              român (art. 1.355).
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              11. SOLUȚIONAREA DISPUTELOR (ANPC / SAL-Fin)
            </h2>
            <p>
              În calitate de consumator în România, ai următoarele căi de soluționare a disputelor:
            </p>
            <ul className="list-none mt-3 space-y-2">
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                <span>
                  <strong>ANPC</strong> — Autoritatea Națională pentru Protecția Consumatorilor:{' '}
                  <a
                    href="https://anpc.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    anpc.ro
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                <span>
                  <strong>SAL-Fin</strong> — Entitatea de Soluționare Alternativă a Litigiilor în
                  domeniul financiar nebancar:{' '}
                  <a
                    href="https://salfin.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    salfin.ro
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                <span>
                  <strong>ODR</strong> — platforma europeană de soluționare online a litigiilor:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              12. LEGEA APLICABILĂ ȘI JURISDICȚIA
            </h2>
            <p>
              Acești termeni sunt guvernați de legea română. Orice litigiu nesoluționat amiabil sau
              prin mecanismele alternative de mai sus va fi soluționat de instanțele competente de
              la sediul SuperFunded SRL, cu excepția cazului în care normele de protecție a
              consumatorului prevăd altceva.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              13. MODIFICĂRI
            </h2>
            <p>
              Ne rezervăm dreptul de a modifica acești termeni. Pentru modificări substanțiale, vom
              notifica utilizatorii cu cel puțin <strong style={{ color: 'var(--white-hi)' }}>15 zile</strong> înainte de intrarea
              în vigoare prin email și banner pe platformă. Utilizarea platformei după intrarea în
              vigoare a noilor termeni constituie acceptul tău. Dacă nu ești de acord, poți cere
              închiderea contului în perioada de preaviz.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              14. CONTACT
            </h2>
            <div
              className="mt-4 p-4 font-mono text-xs space-y-1"
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
            >
              <div>SuperFunded SRL</div>
              <div>Suport: support@thesuperfunded.com</div>
              <div>DPO: dpo@superfunded.ro</div>
              <div>Compliance: compliance@superfunded.ro</div>
              <div>România</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
