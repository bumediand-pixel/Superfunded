'use client';
import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

// Compliance: ONJN/GDPR pack — gate site access until 18+ confirmed.
// Persistence: localStorage `sf_age_ok=true` AND cookie `sf_age_ok=1` (30d).
// Re-prompts on every login flow (cleared on logout via /api/auth/logout).
const STORAGE_KEY = 'sf_age_ok';
const COOKIE_KEY = 'sf_age_ok';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSec}; path=/; samesite=lax${secure}`;
}

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ls = window.localStorage.getItem(STORAGE_KEY);
    const ck = readCookie(COOKIE_KEY);
    if (ls !== 'true' || ck !== '1') {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    writeCookie(COOKIE_KEY, '1', 60 * 60 * 24 * 30); // 30 days
    setVisible(false);
  };

  const decline = () => {
    window.location.href = 'https://jocresponsabil.ro';
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.94)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="rounded-3xl p-8 max-w-md w-full text-center"
        style={{ background: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5"
          style={{ background: '#fff1f2' }}
        >
          <ShieldAlert className="w-8 h-8" style={{ color: 'var(--red)' }} />
        </div>

        <h2 id="age-gate-title" className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
          Ai cel puțin 18 ani?
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          SuperFunded este o platformă destinată exclusiv adulților. Accesul este permis doar persoanelor
          care au împlinit vârsta de 18 ani. Joacă responsabil — vezi resursele la{' '}
          <a
            href="https://jocresponsabil.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: 'var(--red)' }}
          >
            jocresponsabil.ro
          </a>
          .
        </p>

        <div className="flex gap-3">
          <button
            onClick={decline}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Nu, ieși de pe site
          </button>
          <button
            onClick={accept}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}
          >
            Da, am 18+
          </button>
        </div>

        <p className="text-[11px] mt-5" style={{ color: 'var(--text-subtle)' }}>
          Continuând, accepți Termenii și Politica de Confidențialitate.
        </p>
      </div>
    </div>
  );
}
