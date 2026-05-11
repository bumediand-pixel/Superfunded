import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de retenție a datelor',
  description: 'Cât timp păstrăm fiecare categorie de date personale și financiare pe SuperFunded.',
};

const RETENTION = [
  { cat: 'Date cont (email, nume, parolă hash)',     period: 'Activ + 2 ani după închiderea contului', why: 'Recuperare cont accidental, prevenire fraudă' },
  { cat: 'Documente KYC (Sumsub)',                   period: '5 ani după ultima tranzacție', why: 'Obligație AML (Lege 129/2019)' },
  { cat: 'Pariuri (`Pariu`) + tranzacții (`Retragere`)', period: '10 ani după sfârșitul anului fiscal', why: 'Lege Contabilității (Cod 82/1991, art. 25)' },
  { cat: 'Loguri server (IP, user-agent)',          period: '90 zile rolling', why: 'Securitate, debugging' },
  { cat: 'Logs Stripe (plată, refund)',             period: '7 ani', why: 'Conformitate fiscal-financiară' },
  { cat: 'Cookies analytics (Plausible)',           period: 'Anonime, neagregabile', why: 'Statistici de uzabilitate' },
  { cat: 'Cookies marketing (atribuire)',           period: '30 zile', why: 'Atribuire campanii afiliere' },
];

export default function DataRetention() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Confidențialitate
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            Politica de retenție a datelor
          </h1>
          <p className="text-base" style={{ color: 'var(--text-muted)' }}>
            Aici găsești pentru fiecare categorie de date personale sau financiare cât timp le păstrăm și de ce. Detaliile sunt aliniate cu GDPR Art. 5(1)(e) și legislația fiscal-contabilă din România.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border)' }}>
          <div className="grid grid-cols-12 px-5 py-3 border-b text-[10px] font-bold tracking-widest uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <span className="col-span-5">Categorie</span>
            <span className="col-span-3">Perioadă</span>
            <span className="col-span-4">Motiv legal / operațional</span>
          </div>
          {RETENTION.map(r => (
            <div key={r.cat} className="grid grid-cols-12 px-5 py-4 border-b last:border-0 text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              <span className="col-span-5 font-semibold">{r.cat}</span>
              <span className="col-span-3" style={{ color: 'var(--text-muted)' }}>{r.period}</span>
              <span className="col-span-4 text-xs" style={{ color: 'var(--text-muted)' }}>{r.why}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold mt-12 mb-3" style={{ color: 'var(--text)' }}>Drepturile tale</h2>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <li>• <strong>Acces</strong> — primești o copie a datelor pe care le ținem despre tine în 30 zile (cerere prin <a href="/contact" className="text-[var(--red)] font-semibold">Contact</a>).</li>
          <li>• <strong>Rectificare</strong> — corectezi date inexacte din <a href="/dashboard/setari" className="text-[var(--red)] font-semibold">Setări</a>.</li>
          <li>• <strong>Ștergere</strong> — buton "Șterge contul" în Setări. Anonimizăm imediat. Datele financiare păstrate conform legii nu te identifică.</li>
          <li>• <strong>Portabilitate</strong> — export JSON al pariurilor și retragerilor tale, la cerere.</li>
          <li>• <strong>Opoziție</strong> — la procesarea pentru marketing, prin centrul de cookies.</li>
        </ul>

        <p className="text-xs mt-10" style={{ color: 'var(--text-subtle)' }}>
          Operator de date: TheSuperFunded · Ultima actualizare: 2026-05-08 · Întrebări: <a href="mailto:gdpr@thesuperfunded.com" className="text-[var(--red)] font-semibold">gdpr@thesuperfunded.com</a>
        </p>
      </div>
    </main>
  );
}
