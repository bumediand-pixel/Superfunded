export const metadata = { title: 'Țări Suportate – SuperFunded', description: 'Lista țărilor acceptate și restricționate pe platforma SuperFunded.' };

const TARI_ACCEPTATE = [
  'Albania', 'Andorra', 'Austria', 'Azerbaidjan', 'Belarus', 'Belgia', 'Bosnia și Herțegovina',
  'Bulgaria', 'Croația', 'Cipru', 'Republica Cehă', 'Danemarca', 'Estonia', 'Finlanda',
  'Franța', 'Georgia', 'Germania', 'Grecia', 'Ungaria', 'Islanda', 'Irlanda', 'Israel',
  'Italia', 'Kazahstan', 'Letonia', 'Liechtenstein', 'Lituania', 'Luxemburg', 'Malta',
  'Moldova', 'Monaco', 'Muntenegru', 'Olanda', 'Macedonia de Nord', 'Norvegia', 'Polonia',
  'Portugalia', 'România', 'Rusia', 'San Marino', 'Serbia', 'Slovacia', 'Slovenia',
  'Spania', 'Suedia', 'Elveția', 'Turcia', 'Ucraina', 'Regatul Unit',
  'Canada', 'Mexic', 'Argentina', 'Brazilia', 'Chile', 'Columbia',
  'Australia', 'Noua Zeelandă', 'Japonia', 'Coreea de Sud', 'Singapore', 'India',
  'Africa de Sud', 'Nigeria', 'Kenya', 'Maroc', 'Egipt',
  'Emiratele Arabe Unite', 'Arabia Saudită', 'Kuwait', 'Qatar', 'Bahrain',
];

const TARI_RESTRICTIONATE = [
  'Statele Unite ale Americii (SUA)',
  'Franța (pentru anumite servicii)',
  'Ontario, Canada',
  'Cuba',
  'Iran',
  'Coreea de Nord',
  'Siria',
  'Sudan',
  'Myanmar',
  'Irak (pentru anumite regiuni)',
  'Libia',
  'Somalia',
  'Yemen',
  'Zimbabwe',
  'Belarus (sancționate)',
];

export default function TariSuportatePage() {
  return (
    <div className="min-h-screen py-32" style={{ background: 'var(--bg-alt, #fbf8f6)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'var(--red)' }} />
            <span className="font-semibold text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--red)' }}>Global</span>
          </div>
          <h1 className="font-extrabold tracking-tight leading-none mb-4" style={{ fontSize: 'clamp(48px, 8vw, 96px)', letterSpacing: '0.03em' }}>
            ȚĂRI<br/>SUPORTATE
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-muted, #64748b)' }}>
            SuperFunded este disponibil în majority a țărilor din lume. Verifică lista de mai jos pentru a vedea dacă țara ta este acceptată.
          </p>
        </div>

        <div className="space-y-12 text-sm leading-relaxed" style={{ color: 'var(--text-muted, #64748b)' }}>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
              <h2 className="font-extrabold tracking-tight text-2xl tracking-wider" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>ȚĂRI ACCEPTATE</h2>
              <span className="font-semibold text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>{TARI_ACCEPTATE.length} țări</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TARI_ACCEPTATE.sort().map((tara) => (
                <div key={tara} className="flex items-center gap-2 px-3 py-2" style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)' }}>
                  <span style={{ color: '#22c55e', fontSize: '8px' }}>●</span>
                  <span className="text-xs">{tara}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--red)' }} />
              <h2 className="font-extrabold tracking-tight text-2xl tracking-wider" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>ȚĂRI RESTRICȚIONATE</h2>
              <span className="font-semibold text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>{TARI_RESTRICTIONATE.length} jurisdicții</span>
            </div>
            <div className="p-4 mb-4 text-xs" style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.15)' }}>
              Utilizatorii din aceste jurisdicții nu pot accesa sau utiliza platforma SuperFunded. Restricțiile se aplică din motive de conformitate legală și reglementare.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TARI_RESTRICTIONATE.map((tara) => (
                <div key={tara} className="flex items-center gap-2 px-3 py-2" style={{ background: '#ffffff', border: '1px solid rgba(230,57,70,0.1)' }}>
                  <span style={{ color: 'var(--red)', fontSize: '8px' }}>●</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted, #64748b)' }}>{tara}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>CONFORMITATE KYC/AML</h2>
            <p>Indiferent de țara de reședință, toți utilizatorii trebuie să completeze procesul de verificare a identității (KYC) înainte de prima retragere. Procesul implică verificarea actului de identitate și a dovezii de rezidență conform reglementărilor anti-spălare a banilor (AML).</p>
            <p className="mt-3">Utilizatorii din jurisdicțiile cu risc ridicat pot fi supuși unor verificări suplimentare sau pot fi restricționați de la anumite funcționalități ale platformei.</p>
          </section>

          <section>
            <h2 className="font-extrabold tracking-tight text-2xl tracking-wider mb-4" style={{ color: 'var(--text, #0f172a)', letterSpacing: '0.05em' }}>ÎNTREBĂRI</h2>
            <p>Dacă țara ta nu apare în lista de mai sus sau ai întrebări despre eligibilitate, contactează echipa noastră.</p>
            <div className="mt-4 p-4 font-semibold text-xs space-y-1" style={{ background: '#ffffff', border: '1px solid var(--border, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
              <div>Email: support@thesuperfunded.com</div>
              <div>Timp răspuns: 24-48 ore lucrătoare</div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
