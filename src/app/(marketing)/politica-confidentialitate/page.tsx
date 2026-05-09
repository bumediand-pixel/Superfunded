import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate — SuperFunded',
  description:
    'Politica de confidențialitate SuperFunded: temeiuri legale GDPR, categorii de date, procesatori (Supabase, Stripe, Sumsub, Resend, Vercel), drepturile utilizatorului, ANSPDCP.',
};

const LAST_UPDATED = new Date().toLocaleDateString('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const PROCESSORS: Array<{ name: string; purpose: string; jurisdiction: string }> = [
  { name: 'Supabase', purpose: 'Bază de date Postgres + autentificare', jurisdiction: 'SUA / UE (regiune Frankfurt)' },
  { name: 'Stripe', purpose: 'Procesare plăți card, retrageri', jurisdiction: 'Irlanda (Stripe Payments Europe Ltd)' },
  { name: 'Sumsub', purpose: 'Verificare KYC / AML, screening PEP & sancțiuni', jurisdiction: 'Cipru (Sum and Substance Ltd)' },
  { name: 'Resend', purpose: 'Email tranzacțional și de notificare', jurisdiction: 'SUA (Delaware)' },
  { name: 'Vercel', purpose: 'Găzduire aplicație + edge logs + analytics', jurisdiction: 'SUA / UE (regiune Frankfurt)' },
];

export default function PoliticaConfidentialitatePage() {
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
              Legal · GDPR
            </span>
          </div>
          <h1
            className="font-bebas leading-none mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}
          >
            POLITICA DE<br />CONFIDENȚIALITATE
          </h1>
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Ultima actualizare: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--white-mid)' }}>
          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              1. OPERATORUL DE DATE
            </h2>
            <p>
              <strong style={{ color: 'var(--white-hi)' }}>SuperFunded SRL</strong> (în continuare „SuperFunded”, „noi”),
              cu sediul în România (adresă completă de completat la momentul înregistrării finale),
              CUI [completare], număr ordine Registrul Comerțului [completare], este operatorul de
              date cu caracter personal pentru toate activitățile descrise în această politică.
            </p>
            <p className="mt-3">
              Persoana responsabilă cu protecția datelor (DPO) poate fi contactată la{' '}
              <span style={{ color: 'var(--white-hi)' }}>dpo@superfunded.ro</span>.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              2. TEMEIURI LEGALE (ART. 6 GDPR)
            </h2>
            <p>Prelucrăm datele tale pe baza următoarelor temeiuri legale:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Art. 6(1)(b) — executarea contractului: gestionarea contului, evaluarea, retragerile.',
                'Art. 6(1)(c) — obligație legală: KYC, AML, raportare ANAF, ONPCSB, ONJN.',
                'Art. 6(1)(f) — interes legitim: prevenirea fraudei, securitatea platformei, audit logs.',
                'Art. 6(1)(a) — consimțământ: cookies analytics & marketing, comunicări promoționale.',
                'Art. 9(2)(g) — interes public substanțial pentru date biometrice KYC (selfie liveness), prelucrate prin Sumsub.',
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
              3. CATEGORII DE DATE
            </h2>
            <p className="mb-3 font-semibold" style={{ color: 'var(--white-hi)' }}>Date de identificare și contact:</p>
            <ul className="list-none mb-4 space-y-2">
              {[
                'Nume, prenume, data nașterii, CNP (necesar pentru KYC).',
                'Adresă de email, număr telefon, adresă rezidență.',
                'Imagine act de identitate, selfie liveness, dovadă rezidență.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-3 font-semibold" style={{ color: 'var(--white-hi)' }}>Date financiare:</p>
            <ul className="list-none mb-4 space-y-2">
              {[
                'Ultimele 4 cifre ale cardului, marcă card, țară emitentă (Stripe — nu stocăm PAN).',
                'IBAN pentru retrageri (criptat la repaus).',
                'Istoric tranzacții, taxe de evaluare, plăți de profit.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-3 font-semibold" style={{ color: 'var(--white-hi)' }}>Date de utilizare și tehnice:</p>
            <ul className="list-none space-y-2">
              {[
                'Adresă IP, user-agent, fingerprint dispozitiv (anti-fraudă).',
                'Pagini vizitate, durată sesiune, acțiuni pe platformă.',
                'Pariuri simulate plasate (selecții, cote, miză virtuală, rezultat).',
                'Cookie-uri (vezi secțiunea 7).',
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
              4. PERIOADE DE RETENȚIE
            </h2>
            <ul className="list-none space-y-2">
              {[
                'Date cont (activ): pe durata existenței contului.',
                'Date KYC: 5 ani de la închiderea contului (Legea 129/2019 AML).',
                'Date tranzacție: 7 ani (Codul fiscal art. 25; OG 28/1999).',
                'Logs de securitate / audit: 12 luni.',
                'Date marketing: până la retragerea consimțământului sau 24 luni de inactivitate.',
                'Cookie consent log: durata cookie-ului + 12 luni dovadă consimțământ.',
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
              5. PROCESATORI ȘI TRANSFERURI
            </h2>
            <p>
              Folosim următorii sub-procesatori. Toate transferurile către state din afara Spațiului
              Economic European se realizează în temeiul Clauzelor Contractuale Standard (SCC,
              Decizia (UE) 2021/914) și a măsurilor suplimentare conform jurisprudenței Schrems II:
            </p>
            <div className="mt-4 space-y-3">
              {PROCESSORS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3"
                  style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-mono text-xs font-bold shrink-0 w-20" style={{ color: 'var(--red)' }}>
                    {p.name}
                  </span>
                  <span className="flex-1">{p.purpose}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {p.jurisdiction}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4">
              De asemenea, putem dezvălui date către autoritățile competente (ONJN, ANAF, ONPCSB,
              ANSPDCP, instanțe judecătorești) atunci când suntem obligați prin lege.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              6. DREPTURILE TALE
            </h2>
            <p>Conform GDPR (Art. 15-22) ai următoarele drepturi:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Dreptul de acces — să primești o copie a datelor pe care le deținem.',
                'Dreptul la rectificare — corectarea datelor inexacte.',
                'Dreptul la ștergere („dreptul de a fi uitat”) — în limita obligațiilor legale de retenție.',
                'Dreptul la portabilitate — primești un export structurat (JSON / CSV).',
                'Dreptul la restricționare — în anumite condiții.',
                'Dreptul la opoziție — în special pentru marketing direct.',
                'Dreptul de a nu fi supus deciziilor automate (art. 22) — KYC scoring rămâne supravegheat de un analist uman.',
                'Dreptul de a-ți retrage consimțământul în orice moment, fără efect retroactiv.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Pentru a exercita orice drept, trimite o cerere la{' '}
              <span style={{ color: 'var(--white-hi)' }}>dpo@superfunded.ro</span>. Răspundem în
              maxim 30 de zile (extensibil cu 60 de zile pentru cereri complexe).
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              7. COOKIES
            </h2>
            <p>
              Folosim cookie-uri esențiale (sesiune, autentificare, CSRF) — necesare pentru
              funcționarea platformei, pe baza interesului legitim. Pentru cookies analitice și de
              marketing îți cerem consimțământul explicit prin banner-ul de cookies.
            </p>
            <p className="mt-3">
              Înregistrăm consimțământul (data, IP, user-agent, versiunea politicii) pentru a putea
              demonstra acordul tău, conform GDPR. Îți poți retrage consimțământul oricând prin
              ștergerea cookie-ului <span className="font-mono">sf_consent</span> sau accesând din
              nou banner-ul.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              8. SECURITATEA DATELOR
            </h2>
            <p>
              Implementăm măsuri tehnice și organizatorice adecvate: criptare TLS 1.3 în tranzit,
              criptare AES-256 la repaus pentru date sensibile, autentificare cu doi factori pentru
              admin, segregarea mediilor (dev/staging/prod), penetration tests anuale, programe de
              awareness pentru angajați, NDA-uri cu sub-procesatorii.
            </p>
            <p className="mt-3">
              În caz de incident de securitate care implică date personale, vom notifica ANSPDCP în
              termen de 72 de ore conform Art. 33 GDPR și utilizatorii afectați conform Art. 34
              GDPR.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              9. AUTORITATEA DE SUPRAVEGHERE (ANSPDCP)
            </h2>
            <p>
              Ai dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării
              Datelor cu Caracter Personal:
            </p>
            <div
              className="mt-4 p-4 font-mono text-xs space-y-1"
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
            >
              <div>ANSPDCP</div>
              <div>Bd. Gheorghe Magheru 28-30, Sector 1, București</div>
              <div>Email: anspdcp@dataprotection.ro</div>
              <div>
                Web:{' '}
                <a
                  href="https://www.anspdcp.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--white-hi)' }}
                >
                  anspdcp.ro
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl tracking-wider mb-4" style={{ color: 'var(--white-hi)', letterSpacing: '0.05em' }}>
              10. CONTACT
            </h2>
            <div
              className="mt-4 p-4 font-mono text-xs space-y-1"
              style={{ background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
            >
              <div>SuperFunded SRL — DPO</div>
              <div>Email: dpo@superfunded.ro</div>
              <div>Suport: support@thesuperfunded.com</div>
              <div>România</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
