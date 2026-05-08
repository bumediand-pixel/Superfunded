'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

const STORAGE_KEY = 'sf-age-confirmed-v1';

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const confirm = (over18: boolean) => {
    if (over18) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
      setVisible(false);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-3xl p-8 max-w-md w-full text-center"
        style={{ background: 'white', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-5"
          style={{ background: '#fff1f2' }}>
          <ShieldAlert className="w-8 h-8" style={{ color: 'var(--red)' }} />
        </div>

        <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>Ai 18+ ani?</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          SuperFunded este o platformă de evaluare a abilităților sportive. Conținutul nostru este destinat exclusiv adulților peste 18 ani.
          Joacă responsabil — vezi resursele disponibile la{' '}
          <a href="https://www.jocresponsabil.ro" target="_blank" rel="noopener" className="font-semibold hover:underline" style={{ color: 'var(--red)' }}>
            jocresponsabil.ro
          </a>.
        </p>

        <div className="flex gap-3">
          <button onClick={() => confirm(false)}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Sub 18 ani
          </button>
          <button onClick={() => confirm(true)}
            className="flex-1 text-sm font-bold py-3.5 rounded-xl cursor-pointer transition-colors"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            Am 18+ ani
          </button>
        </div>

        <p className="text-[11px] mt-5" style={{ color: 'var(--text-subtle)' }}>
          Continuând, accepți{' '}
          <Link href="/termeni" className="hover:underline">Termenii</Link> și{' '}
          <Link href="/confidentialitate" className="hover:underline">Politica de Confidențialitate</Link>.
        </p>
      </div>
    </div>
  );
}
