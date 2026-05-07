'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to console; Sentry/Vercel will pick it up automatically
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-6"
          style={{ background: '#fff1f2' }}>
          <AlertTriangle className="w-8 h-8" style={{ color: 'var(--red)' }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
          Ceva nu a mers
        </h1>
        <p className="text-base mb-2" style={{ color: 'var(--text-muted)' }}>
          A apărut o eroare neașteptată. Echipa a fost notificată automat.
        </p>
        {error.digest && (
          <p className="text-xs font-mono mb-8 px-3 py-1.5 inline-block rounded-md"
            style={{ background: 'var(--bg-alt2)', color: 'var(--text-subtle)' }}>
            ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <button onClick={reset}
            className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition-all"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            <RefreshCw className="w-4 h-4" />
            Reîncearcă
          </button>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition-all"
            style={{ background: 'white', color: 'var(--text)', border: '1px solid var(--border)' }}>
            <Home className="w-4 h-4" />
            Acasă
          </Link>
        </div>
      </div>
    </main>
  );
}
