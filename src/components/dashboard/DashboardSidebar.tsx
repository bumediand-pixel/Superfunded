'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Target, BarChart3, Wallet, Users, ShieldCheck, Settings, LogOut, Menu, X,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/dashboard/pariuri',   label: 'Picks',      icon: Target },
  { href: '/dashboard/statistici',label: 'Statistici', icon: BarChart3 },
  { href: '/dashboard/retrageri', label: 'Retrageri',  icon: Wallet },
  { href: '/dashboard/afiliere',  label: 'Afiliere',   icon: Users },
  { href: '/dashboard/kyc',       label: 'KYC',        icon: ShieldCheck },
  { href: '/dashboard/setari',    label: 'Setări',     icon: Settings },
] as const;

/**
 * Mobile-first sidebar. Renders as a fixed left rail on lg+ screens, slides in
 * from the left on mobile via a hamburger toggle in the top-left corner.
 * `<header>` of the dashboard layout reserves a 10x10 spacer on mobile to host
 * the toggle button so it never overlaps content.
 */
export default function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile toggle button — fixed top-left so it's always reachable */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Deschide meniu"
        className="lg:hidden fixed top-2.5 left-3 z-40 w-9 h-9 inline-flex items-center justify-center rounded-lg border"
        style={{ background: '#0d0d0d', borderColor: 'rgba(255,255,255,0.1)' }}>
        <Menu className="w-4 h-4 text-white" />
      </button>

      {/* Backdrop on mobile when drawer is open */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 flex flex-col border-r transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-md flex items-center justify-center font-extrabold text-white text-sm"
              style={{ background: 'var(--red, #e63946)' }}>
              SF
            </span>
            <span className="font-extrabold text-base text-white">SuperFunded</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Închide meniu"
            className="lg:hidden text-white/40 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={active
                  ? { background: 'rgba(230,57,70,0.12)', color: '#fff', boxShadow: 'inset 2px 0 0 var(--red, #e63946)' }
                  : { color: 'rgba(255,255,255,0.6)' }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / user */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="px-3 py-2 mb-2 truncate text-xs text-white/40" title={email}>{email}</div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit"
              className="w-full inline-flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
