import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate — SuperFunded',
  description:
    'Politica GDPR a SuperFunded SRL: operatorul de date, temeiurile legale Art. 6 GDPR, categorii de date, persoane împuternicite, drepturi ANSPDCP, retenție și DPO.',
};

const LAST_UPDATED = new Date().toISOString().slice(0, 10); // dynamic per build

export default function PoliticaConfidentialitatePage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <article
        className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-sm prose-pf"
        style={{ color: 'var(--text)' }}
      >

        <DraftBanner />

        <header className="mb-10">
          <span
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}
          >
            Legal · GDPR
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Politica de Confidențialitate
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Ultima actualizare: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            Versiune 1.0
          </p>
        </header>

        <section>
          <h2>1. Operatorul de date</h2>
          <p>
            <strong>SuperFunded SRL</strong> — societate cu răspundere limitată, înregistrată în
            România, cu sediul social în [REPLACE: adresă completă], CUI [REPLACE], înregistrată
            la Registrul Comerțului sub J[REPLACE]. Suntem operatorul de date personale în
            sensul Regulamentului (UE) 2016/679 („GDPR”) și al Legii 190/2018 pentru toate
            datele colectate prin platforma <em>thesuperfunded.com</em>.
          </p>
          <p>
            Responsabilul cu protecția datelor (DPO) poate fi contactat la{' '}
            <a href="mailto:dpo@superfunded.ro"><strong>dpo@superfunded.ro</strong></a>. Răspundem
            cererilor în maxim 30 de zile calendaristice.
          </p>
        </section>

        <section>
          <h2>2. Temeiuri legale (Art. 6 GDPR)</h2>
          <ul>
            <li>
              <strong>Art. 6(1)(b) — executarea contractului</strong>: crearea contului,
              gestionarea evaluărilor, procesarea retragerilor.
            </li>
            <li>
              <strong>Art. 6(1)(c) — obligație legală</strong>: KYC/AML (Legea 129/2019),
              raportare ONPCSB, raportare fiscală ANAF, retenție 5 ani a datelor de
              identificare.
            </li>
            <li>
              <strong>Art. 6(1)(f) — interes legitim</strong>: prevenirea fraudei,
              detecție abuz, securitate IT, audit intern.
            </li>
            <li>
              <strong>Art. 6(1)(a) — consimțământ</strong>: cookies non-esențiale
              (analytics, marketing), comunicări de marketing, newslettere. Consimțământul
              poate fi retras oricând fără afectarea legalității prelucrării anterioare.
            </li>
            <li>
              <strong>Art. 9(2)(g) GDPR + Legea 129/2019</strong>: pentru categoriile
              speciale de date strict legate de obligația AML (de exemplu, indicatori de
              expunere politică — PEP).
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Categorii de date prelucrate</h2>
          <ul>
            <li>
              <strong>Date de identificare</strong>: nume complet, adresă, data nașterii,
              CNP (pentru KYC), serie și număr CI / pașaport, naționalitate.
            </li>
            <li>
              <strong>Date de contact</strong>: email, telefon, adresă poștală.
            </li>
            <li>
              <strong>Date financiare</strong>: IBAN, ultimele 4 cifre ale cardului
              (Stripe stochează tokenul integral — nu noi), adresă wallet crypto pentru
              retrageri pe blockchain.
            </li>
            <li>
              <strong>Date biometrice limitate</strong>: selfie liveness pentru KYC, păstrate
              de Sumsub pe servere UE timp de 5 ani.
            </li>
            <li>
              <strong>Date de utilizare</strong>: pariuri simulate, cote, profituri, drawdown,
              evenimente de risc, log-uri de autentificare.
            </li>
            <li>
              <strong>Date tehnice</strong>: adresă IP, user agent, fingerprint device, geo-IP
              la nivel de țară.
            </li>
            <li>
              <strong>Comunicări</strong>: tichete de suport, conversații cu echipa AML.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Retenție</h2>
          <ul>
            <li><strong>Date KYC / AML</strong>: 5 ani de la închiderea contului (Art. 35 din Legea 129/2019).</li>
            <li><strong>Tranzacții și ledger financiar</strong>: 10 ani (Codul Fiscal, art. 25 din OG 70/1997).</li>
            <li><strong>Log-uri de autentificare și securitate</strong>: 12 luni.</li>
            <li><strong>Cookies non-esențiale</strong>: maxim 12 luni de la momentul consimțământului.</li>
            <li><strong>Tichete de suport</strong>: 24 de luni de la închidere.</li>
            <li><strong>Comunicări de marketing</strong>: până la retragerea consimțământului.</li>
          </ul>
        </section>

        <section>
          <h2>5. Persoane împuternicite (subprocesatori)</h2>
          <p>Datele tale sunt prelucrate, cu garanții contractuale GDPR, de:</p>
          <ul>
            <li>
              <strong>Supabase Inc.</strong> (SUA — Standard Contractual Clauses 2021/914 +
              servere primare în UE) — autentificare, baze de date.
            </li>
            <li>
              <strong>Stripe Payments Europe Ltd.</strong> (Irlanda) — procesare plăți
              card. Sub-procesator: Stripe Inc. (SUA) sub SCC.
            </li>
            <li>
              <strong>Sumsub (Sum and Substance Ltd.)</strong> (Regatul Unit / Cipru) —
              KYC/AML. Date stocate pe servere EEA cu replicare DR în UK (Adequacy
              Decision UE-UK 2021).
            </li>
            <li>
              <strong>Resend Inc.</strong> (SUA — SCC) — emailuri tranzacționale.
            </li>
            <li>
              <strong>Vercel Inc.</strong> (SUA — SCC + DPF) — hosting și CDN edge.
              Datele de aplicație și ledger-ul rămân în baze UE.
            </li>
            <li>
              <strong>The Odds API LLC</strong> (SUA — SCC) — date de cote sportive.
              Nu primește date personale ale utilizatorilor.
            </li>
          </ul>
          <p>
            Lista completă, actualizată la zi, cu jurisdicția și garanțiile aplicabile,
            este disponibilă la cerere la dpo@superfunded.ro.
          </p>
        </section>

        <section>
          <h2>6. Transferuri în afara SEE</h2>
          <p>
            Acolo unde subprocesatorii au sediul principal în afara Spațiului Economic
            European (SUA, UK), transferurile sunt acoperite de Clauzele Contractuale
            Standard 2021/914 ale Comisiei Europene, și/sau de Decizia de Adecvare
            UE-SUA (Data Privacy Framework) și UE-UK. La cerere, putem furniza copii
            ale acordurilor.
          </p>
        </section>

        <section>
          <h2>7. Drepturile tale (Art. 15-22 GDPR)</h2>
          <ul>
            <li><strong>Drept de acces</strong> — copia datelor prelucrate.</li>
            <li><strong>Drept de rectificare</strong> — corectarea datelor inexacte.</li>
            <li><strong>Drept de ștergere</strong> („dreptul de a fi uitat”), în limitele AML/fiscale.</li>
            <li><strong>Drept de restricționare</strong> a prelucrării.</li>
            <li><strong>Drept de portabilitate</strong> — primirea datelor în format JSON / CSV structurat.</li>
            <li><strong>Drept de opoziție</strong> la prelucrarea bazată pe interes legitim sau marketing direct.</li>
            <li><strong>Dreptul de a retrage consimțământul</strong> oricând (cookies, marketing).</li>
            <li>
              <strong>Dreptul de a depune plângere la ANSPDCP</strong> — Autoritatea Națională de
              Supraveghere a Prelucrării Datelor cu Caracter Personal:
              {' '}<address style={{ display: 'inline' }}>
                Bd. General Gheorghe Magheru 28-30, Sector 1, București, cod 010336
              </address>{' '}—{' '}
              <a
                href="https://www.dataprotection.ro"
                target="_blank"
                rel="noopener noreferrer"
              >
                anspdcp.ro
              </a>{' '}/ <a
                href="https://www.dataprotection.ro"
                target="_blank"
                rel="noopener noreferrer"
              >
                dataprotection.ro
              </a>.
            </li>
          </ul>
          <p>
            Pentru exercitarea oricărui drept, scrie la{' '}
            <a href="mailto:dpo@superfunded.ro"><strong>dpo@superfunded.ro</strong></a>{' '}
            — confirmăm primirea în 72h și răspundem în maxim 30 de zile.
          </p>
        </section>

        <section>
          <h2>8. Securitate</h2>
          <p>
            Datele sunt criptate în tranzit (TLS 1.3) și la repaus (AES-256 pentru bazele
            de date primare, KMS managed). Accesul la datele cu caracter personal se face
            pe baza principiului „need-to-know”, cu autentificare multi-factor obligatorie
            pentru staff și log audit pe acțiunile administrative. Realizăm anual penetration
            test cu un furnizor independent.
          </p>
        </section>

        <section>
          <h2>9. Cookies</h2>
          <p>
            Folosim cookies esențiale (necesare pentru autentificare și securitate),
            cookies de analytics (anonimizate, doar cu consimțământ) și cookies de marketing
            (doar cu consimțământ). Detalii și management în bannerul afișat la prima vizită
            sau prin re-deschiderea preferințelor de pe pagina de setări cont.
          </p>
        </section>

        <section>
          <h2>10. Modificări</h2>
          <p>
            Anunțăm orice modificare materială a acestei politici cu cel puțin 15 zile
            înainte de intrare în vigoare, prin email și prin notificare în aplicație.
            Continuarea utilizării după intrarea în vigoare echivalează cu acceptul.
          </p>
        </section>

        <style>{`
          .prose-pf { line-height: 1.7; }
          .prose-pf h2 {
            font-size: 1.25rem;
            font-weight: 800;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: var(--text);
          }
          .prose-pf p { margin: 0.75rem 0; color: var(--text-muted); }
          .prose-pf ul { list-style: disc; padding-left: 1.25rem; margin: 0.75rem 0; }
          .prose-pf li { margin: 0.4rem 0; color: var(--text-muted); }
          .prose-pf strong { color: var(--text); }
          .prose-pf a { color: var(--red); }
          .prose-pf a:hover { text-decoration: underline; }
        `}</style>
      </article>
    </main>
  );
}

function DraftBanner() {
  return (
    <div
      className="rounded-xl p-4 mb-6 text-sm"
      style={{ background: '#fff8e1', border: '1px solid #f59e0b', color: '#7c2d12' }}
    >
      <strong>DRAFT — NU CONSTITUIE CONSULTANȚĂ JURIDICĂ.</strong>
      {' '}Necesită revizuire de către avocat român specializat în iGaming.
    </div>
  );
}
