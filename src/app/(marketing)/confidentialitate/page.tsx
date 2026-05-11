export const metadata = { title: 'Politică de Confidențialitate – SuperFunded', description: 'Politica de confidențialitate a platformei SuperFunded.' };

export default function ConfidentialittatePage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-semibold text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Legal</span>
          </div>
          <h1 className="font-extrabold tracking-tight leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            POLITICĂ DE<br/>CONFIDENȚIALITATE
          </h1>
          <p className="font-semibold text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>Ultima actualizare: 1 Ianuarie 2025</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--text-muted, #64748b)' }}>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>1. INTRODUCERE</h2>
            <p>TheSuperFunded ("SuperFunded", "noi", "nostru") se angajează să protejeze confidențialitatea ta. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, dezvăluim și protejăm informațiile tale atunci când utilizezi platforma noastră la thesuperfunded.com.</p>
            <p className="mt-3">Prin utilizarea Serviciului, ești de acord cu colectarea și utilizarea informațiilor în conformitate cu această politică. Această politică este conformă cu Regulamentul General privind Protecția Datelor (GDPR) al Uniunii Europene.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>2. DATELE PE CARE LE COLECTĂM</h2>
            <p className="mb-3 font-semibold" style={{ color: 'var(--text, #0f172a)' }}>Date furnizate direct de tine:</p>
            <ul className="list-none space-y-2 mb-4">
              {[
                'Date de cont: nume, adresă de email, parolă criptată',
                'Date de plată: procesate prin Stripe — nu stocăm date de card',
                'Date KYC: act de identitate, dovadă rezidență, selfie (procesate prin Sumsub)',
                'Comunicări: mesaje, emailuri de suport',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-3 font-semibold" style={{ color: 'var(--text, #0f172a)' }}>Date colectate automat:</p>
            <ul className="list-none space-y-2">
              {[
                'Date de utilizare: pagini vizitate, funcționalități folosite, acțiuni pe platformă',
                'Date tehnice: adresă IP, tip browser, sistem de operare, rezoluție ecran',
                'Cookie-uri și date de sesiune',
                'Activitatea de pariuri simulată: selecții, cote, profituri/pierderi',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>3. CUM UTILIZĂM DATELE TALE</h2>
            <ul className="list-none space-y-2">
              {[
                'Furnizarea și îmbunătățirea serviciilor noastre',
                'Procesarea plăților și retragerilor',
                'Verificarea identității (KYC) conform reglementărilor AML',
                'Comunicarea cu tine despre contul tău și serviciile noastre',
                'Prevenirea fraudei și asigurarea securității platformei',
                'Respectarea obligațiilor legale',
                'Analize statistice anonimizate pentru îmbunătățirea platformei',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>4. PARTAJAREA DATELOR</h2>
            <p>Nu vindem, nu închiriem și nu facem comerț cu informațiile tale personale. Putem partaja date cu:</p>
            <div className="mt-4 space-y-3">
              {[
                { title: 'Stripe', desc: 'Procesator de plăți — pentru procesarea tranzacțiilor financiare' },
                { title: 'Sumsub', desc: 'Furnizor KYC — pentru verificarea identității conform reglementărilor AML/KYC' },
                { title: 'Supabase', desc: 'Furnizor de baze de date și autentificare — pentru stocarea securizată a datelor' },
                { title: 'Autorități legale', desc: 'Când suntem obligați prin lege sau la solicitarea autorităților competente' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-3" style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)' }}>
                  <span className="font-semibold text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--red)' }}>{item.title}</span>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>5. COOKIE-URI</h2>
            <p>Utilizăm cookie-uri pentru a-ți îmbunătăți experiența pe platforma noastră. Tipuri de cookie-uri utilizate:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Cookie-uri esențiale: necesare pentru funcționarea platformei (autentificare, sesiune)',
                'Cookie-uri de performanță: pentru analiza utilizării platformei (anonimizate)',
                'Cookie-uri de preferințe: pentru memorarea setărilor tale',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">Poți configura browserul să refuze cookie-urile, dar unele funcționalități ale platformei pot fi afectate.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>6. DREPTURILE TALE (GDPR)</h2>
            <p>Conform GDPR, ai următoarele drepturi privind datele tale personale:</p>
            <ul className="list-none mt-3 space-y-2">
              {[
                'Dreptul de acces: să soliciti o copie a datelor tale personale',
                'Dreptul la rectificare: să corectezi datele inexacte',
                'Dreptul la ștergere ("dreptul de a fi uitat")',
                'Dreptul la restricționarea prelucrării',
                'Dreptul la portabilitatea datelor',
                'Dreptul de opoziție față de prelucrare',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">Pentru a exercita oricare dintre aceste drepturi, contactează-ne la <span style={{ color: 'var(--text, #0f172a)' }}>support@thesuperfunded.com</span>. Vom răspunde în termen de 30 de zile.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>7. SECURITATEA DATELOR</h2>
            <p>Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele tale personale împotriva accesului neautorizat, alterării, dezvăluirii sau distrugerii. Acestea includ criptarea SSL/TLS, criptarea datelor sensibile în baza de date, autentificarea cu doi factori și monitorizarea continuă a securității.</p>
            <p className="mt-3">Deși ne străduim să utilizăm mijloace acceptabile comercial pentru a-ți proteja datele, nicio metodă de transmitere prin internet sau metodă de stocare electronică nu este 100% sigură.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>8. RETENȚIA DATELOR</h2>
            <p>Păstrăm datele tale personale atât timp cât este necesar pentru furnizarea serviciilor și respectarea obligațiilor legale. Datele KYC sunt păstrate minimum 5 ani conform reglementărilor AML. Datele de tranzacție sunt păstrate 7 ani conform legislației fiscale române.</p>
            <p className="mt-3">La ștergerea contului, datele personale vor fi șterse în termen de 30 de zile, cu excepția datelor pe care suntem obligați să le păstrăm prin lege.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>9. CONTACT</h2>
            <p>Responsabilul cu protecția datelor (DPO) poate fi contactat la:</p>
            <div className="mt-4 p-4 font-semibold text-xs space-y-1" style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
              <div>TheSuperFunded — DPO</div>
              <div>Email: support@thesuperfunded.com</div>
              <div>România</div>
            </div>
            <p className="mt-4">De asemenea, ai dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) din România.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
