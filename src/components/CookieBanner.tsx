'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'sf-cookie-consent-v1';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = (level: 'all' | 'essential') => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ level, ts: Date.now() }));
    window.dispatchEvent(new CustomEvent('sf-consent', { detail: { level } }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-6 md:bottom-6 md:max-w-md">
      <div className="rounded-2xl p-5"
        style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(15,23,42,0.18)' }}>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: '#fff1f2' }}>
            <Cookie className="w-5 h-5" style={{ color: 'var(--red)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-sm mb-1" style={{ color: 'var(--text)' }}>Cookies pe SuperFunded</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Folosim cookies esențiale pentru autentificare și plăți, plus analytics anonime pentru îmbunătățirea platformei.{' '}
              <Link href="/confidentialitate" className="font-semibold hover:underline" style={{ color: 'var(--red)' }}>
                Detalii
              </Link>
            </p>
            <div className="flex gap-2">
              <button onClick={() => accept('essential')}
                className="flex-1 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                Doar esențiale
              </button>
              <button onClick={() => accept('all')}
                className="flex-1 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors"
                style={{ background: 'var(--red)', color: 'white' }}>
                Acceptă tot
              </button>
            </div>
          </div>
          <button onClick={() => accept('essential')} aria-label="Închide"
            className="text-current opacity-30 hover:opacity-100 transition-opacity p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
