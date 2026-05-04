import Link from 'next/link';

const LINKS_PLATFORMA = [
  { label: 'Cum Funcționează', href: '/#cum-functioneaza' },
  { label: 'Planuri & Prețuri', href: '/#planuri' },
  { label: 'Sporturi', href: '/#sporturi' },
  { label: 'Leaderboard', href: '/#leaderboard' },
  { label: 'FAQ', href: '/#faq' },
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
    <footer style={{ background: 'var(--black-0)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 flex items-center justify-center font-bebas text-base"
                style={{
                  background: 'var(--red)',
                  clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
                  color: 'white',
                  letterSpacing: '0.05em',
                }}>
                SF
              </div>
              <span className="font-bebas text-2xl tracking-widest" style={{ color: 'var(--white-hi)', letterSpacing: '0.1em' }}>SUPERFUNDED</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Platforma de betting prop firm #1 din România. Capitalul nostru, profitul tău. Capital disponibil: până la €50.000.
            </p>
            <div className="flex flex-col gap-1 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <span>support@superfunded.ro</span>
              <span>Discord: discord.gg/superfunded</span>
              <span>Telegram: @superfunded</span>
            </div>
          </div>

          {/* Platformă */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--red)' }}>Platformă</div>
            <ul className="space-y-2.5">
              {LINKS_PLATFORMA.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-xs transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cont */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--red)' }}>Cont</div>
            <ul className="space-y-2.5">
              {LINKS_CONT.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-xs transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-5" style={{ color: 'var(--red)' }}>Legal</div>
            <ul className="space-y-2.5">
              {LINKS_LEGAL.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-xs transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Disclaimer bar */}
        <div className="px-5 py-4 mb-8" style={{ background: 'rgba(230,57,70,0.04)', border: '1px solid rgba(230,57,70,0.1)' }}>
          <p className="text-[10px] leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span style={{ color: 'rgba(230,57,70,0.7)', fontWeight: 700 }}>AVERTISMENT:</span>{' '}
            SuperFunded este o platformă de evaluare a abilităților sportive, nu un operator de pariuri. Nu plasăm pariuri reale. Taxa de evaluare reprezintă accesul la program, nu o miză de joc. Participarea implică riscul pierderii taxei dacă nu treci evaluarea. Vârsta minimă: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>18 ani</strong>. Jocul responsabil: <strong style={{ color: 'rgba(255,255,255,0.5)' }}>jocresponsabil.ro</strong>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
            © 2025 SuperFunded SRL · Înregistrat în România · Toate drepturile rezervate
          </span>
          <div className="flex items-center gap-4">
            {LINKS_LEGAL.slice(0, 3).map(({ label, href }) => (
              <Link key={href} href={href}
                className="font-mono text-[9px] uppercase tracking-widest transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.18)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
