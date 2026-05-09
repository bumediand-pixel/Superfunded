import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termeni și Condiții — SuperFunded',
  description:
    'Termenii și condițiile platformei SuperFunded: jurisdicție România, ANPC/SAL-Fin, reguli de retragere, țări restricționate, modificări notificate cu 15 zile înainte.',
};

const LAST_UPDATED = new Date().toISOString().slice(0, 10);

export default function TermeniSiConditiiPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <article
        className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-sm prose-tc"
        style={{ color: 'var(--text)' }}
      >

        <DraftBanner />

        <header className="mb-10">
          <span
            className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}
          >
            Legal · T&amp;C
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Termeni și Condiții
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Ultima actualizare: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> ·
            Versiune 1.0
          </p>
        </header>

        <section>
          <h2>1. Părțile contractului</h2>
          <p>
            Prezentele condiții reglementează raportul juridic dintre <strong>SuperFunded SRL</strong>,
            persoană juridică română cu sediul în [REPLACE], CUI [REPLACE], înregistrată la
            Registrul Comerțului sub J[REPLACE] („SuperFunded”, „noi”) și utilizatorul persoană
            fizică majoră („Utilizatorul”, „tu”) care accesează platforma <em>thesuperfunded.com</em>.
          </p>
        </section>

        <section>
          <h2>2. Eligibilitate</h2>
          <ul>
            <li>Vârstă minimă: 18 ani împliniți la data deschiderii contului.</li>
            <li>Capacitate deplină de exercițiu conform legii române.</li>
            <li>Reședință în afara listei de țări restricționate (vezi secțiunea 11).</li>
            <li>Promiti că nu ești înscris în Registrul ONJN al persoanelor auto-excluse.</li>
            <li>Un singur cont per persoană fizică / per gospodărie.</li>
          </ul>
        </section>

        <section>
          <h2>3. Natura serviciului</h2>
          <p>
            SuperFunded este o platformă de evaluare a abilităților de prognoză sportivă pe bază
            de capital virtual. Statutul reglementar (ONJN / non-ONJN) este în curs de
            clarificare juridică — vezi disclaimer-ul global afișat în footer. În cazul în care
            autoritatea competentă va califica activitatea ca jocuri de noroc, SuperFunded se
            obligă să obțină licență ONJN sau să suspende serviciul pentru rezidenții români.
          </p>
        </section>

        <section>
          <h2>4. Tarife și plăți</h2>
          <ul>
            <li>Taxa de evaluare este unică, exprimată în EUR, plătibilă prin Stripe (card 3DS).</li>
            <li>Nu percepem abonamente recurente fără acordul tău explicit.</li>
            <li>Profitul share-uit se virează după validarea KYC complet și după trecerea perioadei de drawdown rule-check.</li>
          </ul>
        </section>

        <section>
          <h2>5. Retrageri</h2>
          <ul>
            <li>Plata minimă pentru retragere: 50 EUR (sau echivalent crypto).</li>
            <li>Procesare în 24-72h lucrătoare după aprobare KYC.</li>
            <li>Doar către conturi pe numele Utilizatorului verificat — niciodată către terțe persoane.</li>
            <li>
              Pragul AML de raportare: tranzacții ≥ 10.000 EUR (cumulat 24h) sau cele care
              îndeplinesc indicatorii de tranzacție suspectă sunt raportate la <strong>ONPCSB</strong>{' '}
              conform Legii 129/2019 fără notificarea Utilizatorului (interdicție expresă în
              Art. 27 din lege).
            </li>
            <li>
              Refuzăm retrageri către wallet-uri / IBAN-uri din țările sancționate (UE, OFAC,
              FATF blacklist) — fondurile rămân blocate până la clarificare.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Drept de retragere — consumator</h2>
          <p>
            Conform <strong>OUG 34/2014</strong> privind drepturile consumatorilor în contractele
            la distanță, ai 14 zile calendaristice de la achiziționarea unui pachet pentru a te
            retrage <em>cu condiția să nu fi început deja evaluarea</em>. Începerea evaluării
            (plasarea primului pariu virtual) constituie cerere expresă de executare anticipată
            și pierderea dreptului de retragere — informare obligatorie conform Art. 16 lit. m).
          </p>
        </section>

        <section>
          <h2>7. Joc responsabil</h2>
          <p>
            Implementăm măsuri de joc responsabil conform recomandărilor ONJN și EGBA: limită
            de depunere și pierdere personalizabilă, auto-excludere voluntară, reality check,
            cool-off de 7 zile la mărirea oricărei limite. Resurse complete pe pagina{' '}
            <a href="/joc-responsabil"><strong>/joc-responsabil</strong></a>.
          </p>
        </section>

        <section>
          <h2>8. KYC / AML</h2>
          <p>
            Verificarea identității este obligatorie înaintea primei retrageri. Nerespectarea
            cerințelor KYC duce la blocarea contului și păstrarea fondurilor în custodie până
            la clarificare. Pentru detalii vezi pagina{' '}
            <a href="/aml-kyc"><strong>/aml-kyc</strong></a>.
          </p>
        </section>

        <section>
          <h2>9. Răspundere</h2>
          <p>
            SuperFunded nu garantează absența pierderilor. Toate sumele afișate ca „capital”
            în timpul evaluării sunt virtuale; doar profitul share-uit din contul finanțat
            reprezintă bani reali. Răspunderea noastră maximă este limitată la suma plătită
            de Utilizator în ultimele 12 luni, cu excepția cazurilor în care legea imperativă
            impune un alt regim (vătămare corporală, dol, culpă gravă).
          </p>
        </section>

        <section>
          <h2>10. Modificări</h2>
          <p>
            Putem modifica acești termeni — orice modificare materială (preț, regim de
            retragere, structură de evaluare) se anunță cu cel puțin <strong>15 zile</strong>{' '}
            calendaristice înainte de intrare în vigoare prin email și banner în aplicație.
            Dacă nu accepți modificarea, ai dreptul la rezilierea contului și retragerea
            soldului în condițiile pre-modificare.
          </p>
        </section>

        <section>
          <h2>11. Țări restricționate</h2>
          <p>
            Serviciul nu este disponibil rezidenților din: SUA, Marea Britanie (până la
            licență FCA), Australia, Singapore, Iran, Coreea de Nord, Cuba, Siria, Sudan,
            Belarus, Rusia, Venezuela, Myanmar, Crimeea / Donețk / Lugansk. Lista completă
            și actualizată este disponibilă pe{' '}
            <a href="/tari-suportate"><strong>/tari-suportate</strong></a>.
          </p>
        </section>

        <section>
          <h2>12. Soluționarea disputelor</h2>
          <ul>
            <li>
              <strong>Plângeri direct la SuperFunded</strong>: scrie la{' '}
              <a href="mailto:support@thesuperfunded.com"><strong>support@thesuperfunded.com</strong></a>.
              Răspundem în 5 zile lucrătoare.
            </li>
            <li>
              <strong>ANPC</strong> — Autoritatea Națională pentru Protecția Consumatorilor:{' '}
              <a
                href="https://anpc.ro"
                target="_blank"
                rel="noopener noreferrer"
              >
                anpc.ro
              </a>.
            </li>
            <li>
              <strong>SAL-Fin</strong> (Centrul de Soluționare Alternativă a Litigiilor în
              domeniul financiar non-bancar) — pentru dispute legate de plăți și retrageri:{' '}
              <a
                href="https://www.salfin.ro"
                target="_blank"
                rel="noopener noreferrer"
              >
                salfin.ro
              </a>.
            </li>
            <li>
              <strong>Platforma SOL UE</strong> (Online Dispute Resolution):{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>.
            </li>
            <li>
              <strong>Instanțe de drept comun</strong> — judecătorul competent este cel de
              la sediul SuperFunded SRL, fără a se aduce atingere drepturilor imperative ale
              consumatorului român de a sesiza instanța de la domiciliul său.
            </li>
          </ul>
        </section>

        <section>
          <h2>13. Lege aplicabilă</h2>
          <p>
            Contractul este guvernat de legea română. Pentru consumatorii UE, prevederile
            imperative ale statului de reședință obișnuită prevalează.
          </p>
        </section>

        <section>
          <h2>14. Contact</h2>
          <ul>
            <li>Suport general: <a href="mailto:support@thesuperfunded.com">support@thesuperfunded.com</a></li>
            <li>Conformitate / GDPR: <a href="mailto:dpo@superfunded.ro">dpo@superfunded.ro</a></li>
            <li>Afiliere: <a href="mailto:afiliere@thesuperfunded.com">afiliere@thesuperfunded.com</a></li>
          </ul>
        </section>

        <style>{`
          .prose-tc { line-height: 1.7; }
          .prose-tc h2 {
            font-size: 1.25rem;
            font-weight: 800;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: var(--text);
          }
          .prose-tc p { margin: 0.75rem 0; color: var(--text-muted); }
          .prose-tc ul { list-style: disc; padding-left: 1.25rem; margin: 0.75rem 0; }
          .prose-tc li { margin: 0.4rem 0; color: var(--text-muted); }
          .prose-tc strong { color: var(--text); }
          .prose-tc a { color: var(--red); }
          .prose-tc a:hover { text-decoration: underline; }
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
