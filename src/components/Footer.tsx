import Link from 'next/link';

const LINKS_PLATFORMA = [
  { label: 'Cum Funcționează', href: '/#cum-functioneaza' },
  { label: 'Planuri & Prețuri', href: '/#planuri' },
  { label: 'Sporturi', href: '/#sporturi' },
  { label: 'Clasament', href: '/clasament' },
  { label: 'FAQ', href: '/faq' },
];

const LINKS_LEGAL = [
  { label: 'Termeni & Condiții', href: '/termeni' },
  { label: 'Politică Confidențialitate', href: '/confidentialitate' },
  { label: 'Politică Rambursare', href: '/rambursare' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Țări Suportate', href: '/tari-suportate' },
];

const LINKS_CONT = [
  { label: 'Autentificare', href: '/autentificare/login' },
  { label: 'Înregistrare', href: '/autentificare/register' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Retrageri', href: '/dashboard/retrageri' },
  { label: 'Verificare KYC', href: '/dashboard/kyc' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--red)' }}>
                <span className="font-bebas text-white text-sm tracking-wider">SF</span>
              </div>
              <span className="font-jakarta font-extrabold text-lg text-white">SuperFunded</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Prima betting prop firm din România. Capitalul nostru, profitul tău — până la €50.000 per cont finanțat.
            </p>
            <div className="flex flex-col gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>support@superfunded.ro</span>
              <span>Discord: discord.gg/superfunded</span>
            </div>
          </div>

          {/* Platformă */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Platformă</div>
            <ul className="space-y-2.5">
              {LINKS_PLATFORMA.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cont */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Cont</div>
            <ul className="space-y-2.5">
              {LINKS_CONT.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Legal</div>
            <ul className="space-y-2.5">
              {LINKS_LEGAL.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-5 py-4 rounded-xl mb-8" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.15)' }}>
          <p className="text-xs leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span style={{ color: 'rgba(230,57,70,0.8)', fontWeight: 700 }}>AVERTISMENT:</span>{' '}
            SuperFunded e o platformă de evaluare a abilităților sportive, nu un operator de pariuri. Nu plasăm pariuri reale —
            taxa de challenge îți dă acces la programul de evaluare. Vârsta minimă: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>18 ani</strong>.
            Joacă responsabil: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>jocresponsabil.ro</strong>
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2026 SuperFunded SRL · Înregistrat în România · Toate drepturile rezervate
          </span>
          <div className="flex items-center gap-4">
            {LINKS_LEGAL.slice(0, 3).map(({ label, href }) => (
              <Link key={href} href={href} className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
