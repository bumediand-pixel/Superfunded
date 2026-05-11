import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SkillEvalBanner from '@/components/dashboard/SkillEvalBanner';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import ThemeToggle from '@/components/dashboard/ThemeToggle';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch { /* server components can't mutate cookies */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/autentificare/login');

  return (
    <div className="min-h-screen"
      style={{ background: 'var(--dash-bg, #0a0a0a)', color: 'var(--dash-text, #ffffff)' }}>
      <DashboardSidebar email={user.email ?? ''} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 lg:px-6 h-14 border-b backdrop-blur-md"
          style={{ background: 'var(--dash-surface, rgba(13,13,13,0.85))', borderColor: 'var(--dash-border, rgba(255,255,255,0.06))' }}>
          {/* Spacer for mobile menu button (in DashboardSidebar) */}
          <div className="lg:hidden w-10" />
          <Link href="/dashboard" className="flex-1 lg:flex-none flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 rounded-md flex items-center justify-center font-extrabold text-xs flex-shrink-0"
              style={{ background: 'var(--red, #e63946)', color: '#fff' }}>SF</span>
            <span className="font-extrabold text-base truncate" style={{ color: 'var(--dash-text)' }}>SuperFunded</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
          </div>
        </header>
        <SkillEvalBanner />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
