import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { Wallet, Users, ShieldAlert, BarChart3 } from 'lucide-react';

const NAV = [
  { href: '/admin/retrageri', label: 'Retrageri',  icon: Wallet },
  { href: '/admin/utilizatori', label: 'Utilizatori', icon: Users },
  { href: '/admin/conturi',  label: 'Conturi',     icon: ShieldAlert },
  { href: '/admin',          label: 'Overview',    icon: BarChart3 },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect('/');

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      <aside className="w-56 flex-shrink-0 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="font-bebas text-lg tracking-widest text-white">SF · ADMIN</span>
          <p className="text-[10px] mt-1 text-white/40 truncate">{user.email}</p>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
