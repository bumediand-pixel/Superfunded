import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const NAV = [
  { href: '/dashboard', label: 'Vedere generală', icon: '📊' },
  { href: '/dashboard/pariuri', label: 'Pariuri', icon: '🎯' },
  { href: '/dashboard/retrageri', label: 'Retrageri', icon: '💸' },
  { href: '/dashboard/kyc', label: 'KYC', icon: '🪪' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/autentificare/login');

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="w-64 shrink-0 bg-[#0d0d0d] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-sm">BF</span>
            <span className="font-black text-white text-lg">SuperFunded</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="text-white/40 text-xs truncate mb-3">{user.email}</div>
          <form action="/api/auth/logout" method="POST">
            <button className="w-full text-left text-white/40 hover:text-white text-sm transition-colors">Ieși din cont →</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
