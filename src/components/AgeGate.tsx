'use client';
/**
 * 18+ age-verification gate (ONJN / responsible-gambling compliance).
 *
 * Behavior:
 * - Shown until the visitor confirms they are 18+ at least once.
 * - Confirmation is persisted in BOTH localStorage (`sf_age_ok=true`) and a
 *   first-party cookie (`sf_age_ok=1`, max-age 30 days, Secure, SameSite=Lax),
 *   so the gate isn't re-shown on every visit.
 * - Re-prompts on every login: when Supabase auth state flips to a fresh
 *   session that the gate hasn't seen yet, the localStorage flag is cleared
 *   and the gate reappears. The cookie is also cleared on logout.
 * - "Nu" sends the user to https://jocresponsabil.ro (the official RO
 *   responsible-gambling resource).
 *
 * NOTE: This is the legal age gate. It is intentionally blocking and visually
 * loud. Do NOT add a "skip" or "remind me later" path.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

const STORAGE_KEY = 'sf_age_ok';
const LEGACY_KEY = 'sf-age-confirmed-v1'; // backwards-compat with the old gate
const COOKIE_NAME = 'sf_age_ok';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ls = window.localStorage.getItem(STORAGE_KEY) === 'true'
      || !!window.localStorage.getItem(LEGACY_KEY);
    const ck = readCookie(COOKIE_NAME) === '1';

    if (!ls || !ck) setVisible(true);

    const onAuth = (e: Event) => {
      const detail = (e as CustomEvent<{ event?: string }>).detail;
      if (detail?.event === 'SIGNED_IN') {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_KEY);
        setVisible(true);
      } else if (detail?.event === 'SIGNED_OUT') {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_KEY);
        clearCookie(COOKIE_NAME);
      }
    };
    window.addEventListener('sf-auth', onAuth);
    return () => window.removeEventListener('sf-auth', onAuth);
  }, []);

  const confirm = (over18: boolean) => {
    if (!over18) {
      window.location.href = 'https://jocresponsabil.ro';
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch { /* localStorage may be blocked — cookie still works */ }
    writeCookie(COOKIE_NAME, '1', COOKIE_MAX_AGE);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sf-age-gate-title"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(8px)' }}
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

        <h2 id="sf-age-gate-title" className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
          Ai cel puțin 18 ani?
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          SuperFunded este o platformă destinată exclusiv adulților peste 18 ani. Conținutul este
          legat de pariuri sportive şi implică riscuri financiare reale. Joacă responsabil — vezi
          resursele disponibile la{' '}
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
            type="button"
            onClick={() => confirm(false)}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Nu, ieși de pe site
          </button>
          <button
            type="button"
            onClick={() => confirm(true)}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}
          >
            Da, am 18+
          </button>
        </div>

        <p className="text-[11px] mt-5" style={{ color: 'var(--text-subtle)' }}>
          Continuând, accepți{' '}
          <Link href="/termeni-si-conditii" className="hover:underline">Termenii</Link>{' '}și{' '}
          <Link href="/politica-confidentialitate" className="hover:underline">Politica de Confidențialitate</Link>.
        </p>
      </div>
    </div>
  );
}
