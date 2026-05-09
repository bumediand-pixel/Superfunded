import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Joc Responsabil — SuperFunded',
  description:
    'Resurse, contacte și instrumente pentru joc responsabil: auto-excludere, limite de depunere/pierdere, semne de problemă și linii de asistență (Joc Responsabil 0800 800 099).',
};

export default function JocResponsabilPage() {
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
            <span
              className="font-mono text-xs tracking-[0.22em] uppercase"
              style={{ color: 'var(--red)' }}
            >
              Compliance
            </span>
          </div>
          <h1
            className="font-bebas leading-none mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}
          >
            JOC<br />RESPONSABIL
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            18+ · Joacă responsabil · Pierde doar ce îți permiți
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>
          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              1. CE ESTE JOCUL RESPONSABIL
            </h2>
            <p>
              Jocul responsabil înseamnă să tratezi pariurile sportive (sau orice formă de joc cu
              miză) ca pe o activitate de divertisment, nu ca pe o sursă de venit sau o soluție la
              probleme financiare, emoționale sau personale. Pentru majoritatea oamenilor, pariurile
              rămân o experiență controlată; pentru o minoritate, ele pot deveni o problemă.
            </p>
            <p className="mt-3">
              SuperFunded promovează o cultură a controlului: limite stricte de pierdere, KYC
              obligatoriu, vârstă minimă 18 ani, și mecanisme de auto-excludere. Dacă simți că nu
              mai controlezi situația, oprește-te și apelează una dintre liniile de mai jos.
            </p>
          </section>

          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              2. SEMNE DE PROBLEMĂ
            </h2>
            <p>Verifică-te onest. Dacă te recunoști în mai multe dintre punctele de mai jos, este momentul să iei o pauză:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Pariezi sume tot mai mari pentru a obține același nivel de „adrenalină”.',
                'Te gândești constant la pariurile anterioare sau la cele viitoare.',
                'Ai încercat să te oprești sau să reduci, fără succes.',
                'Pariezi pentru a recupera pierderi („chasing losses”).',
                'Minți familia sau prietenii despre cât de mult joci.',
                'Pariezi cu bani pe care i-ai destinat chiriei, mâncării sau facturilor.',
                'Împrumuți bani sau vinzi obiecte ca să continui să joci.',
                'Te simți anxios, depresiv sau iritabil când nu joci.',
                'Pierzi job-uri, relații sau oportunități din cauza jocului.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              3. AUTO-EXCLUDERE
            </h2>
            <p>
              Poți solicita auto-excluderea de pe platforma SuperFunded în orice moment. Excluderea
              poate fi:
            </p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Temporară — 7 zile, 30 zile, 6 luni — contul este suspendat și nu poți crea altele cu același CNP.',
                'Permanentă — contul este închis definitiv, datele tale KYC sunt păstrate strict pentru a împiedica re-deschiderea.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Pentru a solicita auto-excludere, trimite un email la{' '}
              <span style={{ color: 'var(--white-hi)' }}>support@thesuperfunded.com</span> cu
              subiectul „Auto-excludere” și perioada dorită. Procesăm cererea în maxim 24 de ore. De
              asemenea, te poți înregistra în Registrul Național al Auto-Excluderilor administrat de
              ONJN (după lansarea registrului public).
            </p>
          </section>

          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              4. LIMITE DE DEPUNERE / PIERDERE
            </h2>
            <p>
              SuperFunded aplică din oficiu limite de pierdere prin design-ul produsului: drawdown
              maxim 8%, limită zilnică de pierdere 5%. În plus, poți seta limite personale:
            </p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Limită zilnică de depunere — suma maximă pe care o poți achiziționa în 24h.',
                'Limită săptămânală/lunară de depunere.',
                'Time-out — blocaj temporar al contului (24h, 7 zile, 30 zile).',
                'Reality-check — notificare la fiecare 30/60/120 minute de utilizare.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Limitele pot fi reduse oricând cu efect imediat. Creșterea unei limite are o perioadă
              de „cooling-off” de 7 zile.
            </p>
          </section>

          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              5. CONTACTE ȘI ASISTENȚĂ
            </h2>
            <p>Dacă tu sau cineva apropiat are o problemă cu jocul, contactează:</p>
            <div className="mt-4 space-y-3">
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
                style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>
                  Joc Responsabil
                </span>
                <div className="flex-1">
                  <a href="tel:0800800099" className="font-bold underline" style={{ color: 'var(--white-hi)' }}>
                    0800 800 099
                  </a>{' '}
                  · gratuit, 24/7 ·{' '}
                  <a
                    href="https://jocresponsabil.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    jocresponsabil.ro
                  </a>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
                style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>
                  Gambling Therapy
                </span>
                <div className="flex-1">
                  Suport internațional în limba română ·{' '}
                  <a
                    href="https://gamblingtherapy.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    gamblingtherapy.org
                  </a>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
                style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>
                  ONJN
                </span>
                <div className="flex-1">
                  Oficiul Național pentru Jocuri de Noroc ·{' '}
                  <a
                    href="https://onjn.gov.ro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--white-hi)' }}
                  >
                    onjn.gov.ro
                  </a>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
                style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-mono text-xs font-bold shrink-0" style={{ color: 'var(--red)' }}>
                  SuperFunded
                </span>
                <div className="flex-1">
                  Pentru auto-excludere și limite:{' '}
                  <span style={{ color: 'var(--white-hi)' }}>support@thesuperfunded.com</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2
              className="font-bebas text-2xl tracking-wider mb-4"
              style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}
            >
              6. PROTEJAREA MINORILOR
            </h2>
            <p>
              Vârsta minimă pentru utilizarea SuperFunded este de 18 ani. Folosim un age-gate pe
              fiecare sesiune și verificare KYC obligatorie înainte de orice retragere. Dacă ești
              părinte și ai motive să crezi că un minor a accesat platforma, contactează-ne imediat
              la <span style={{ color: 'var(--white-hi)' }}>support@thesuperfunded.com</span>.
            </p>
            <p className="mt-3">
              Recomandăm instalarea de soluții de control parental (Net Nanny, Qustodio, Family
              Link) pe toate dispozitivele utilizate de minori.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
