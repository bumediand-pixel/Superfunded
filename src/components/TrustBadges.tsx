import { ShieldCheck, Lock, BadgeCheck, FileCheck } from 'lucide-react';

const BADGES = [
  { icon: Lock,        title: 'Plăți securizate',        sub: 'prin Stripe (PCI DSS Level 1)' },
  { icon: ShieldCheck, title: 'KYC verificat',           sub: 'prin Sumsub (utilizat de banci)' },
  { icon: BadgeCheck,  title: 'GDPR compliant',          sub: 'date stocate în UE (Supabase EU)' },
  { icon: FileCheck,   title: 'Companie înregistrată',   sub: 'în România (registrul comerțului)' },
];

export default function TrustBadges() {
  return (
    <section className="py-12" style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-bold tracking-widest uppercase mb-6" style={{ color: 'var(--text-muted)' }}>
          Securitate &amp; conformitate
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: 'white', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ background: '#fff1f2' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--red)' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-tight" style={{ color: 'var(--text)' }}>{b.title}</div>
                  <div className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{b.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
