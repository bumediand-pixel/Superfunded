import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Pagina nu există',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-lg w-full text-center">
        <div className="font-bebas text-[160px] md:text-[220px] leading-none mb-2 select-none"
          style={{ color: 'var(--red)', letterSpacing: '-0.04em' }}>
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
          Pickul ăsta a căzut
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
          Pagina pe care o cauți nu există sau a fost mutată. Întoarce-te la home sau verifică planurile.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition-all"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            <Home className="w-4 h-4" />
            Acasă
          </Link>
          <Link href="/calculators"
            className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition-all"
            style={{ background: 'white', color: 'var(--text)', border: '1px solid var(--border)' }}>
            <Search className="w-4 h-4" />
            Calculatoare
          </Link>
        </div>
      </div>
    </main>
  );
}
