'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';

const STORAGE_KEY = 'sf-cookie-consent-v1';

type Categories = {
  essential: true;        // always on, cannot be unchecked
  performance: boolean;
  functional: boolean;
  marketing: boolean;
};

type Consent = { ts: number; cats: Categories };

const DEFAULT: Categories = { essential: true, performance: false, functional: false, marketing: false };

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cats, setCats] = useState<Categories>(DEFAULT);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const persist = (c: Categories) => {
    const consent: Consent = { ts: Date.now(), cats: c };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    // Backwards-compat with v1 single-level analytics gate (Analytics component reads `level: 'all'`)
    const fauxLevel = c.performance && c.marketing ? 'all' : 'essential';
    window.localStorage.setItem('sf-cookie-consent-v1-level', fauxLevel);
    window.dispatchEvent(new CustomEvent('sf-consent', { detail: { level: fauxLevel, cats: c } }));
    setVisible(false);
  };

  const acceptAll = () => persist({ essential: true, performance: true, functional: true, marketing: true });
  const acceptEssential = () => persist({ essential: true, performance: false, functional: false, marketing: false });
  const saveSelection  = () => persist(cats);

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
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              Folosim cookies pentru autentificare, performanță și analytics anonime.{' '}
              <Link href="/confidentialitate" className="font-semibold hover:underline" style={{ color: 'var(--red)' }}>
                Detalii
              </Link>
            </p>

            {showDetails && (
              <div className="space-y-2 mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-alt2)' }}>
                <CategoryRow label="Esențiale"   sub="auth, plată, KYC — obligatorii" checked disabled />
                <CategoryRow label="Performanță" sub="analytics anonime"   checked={cats.performance}  onChange={v => setCats({ ...cats, performance: v })} />
                <CategoryRow label="Funcționale" sub="preferințe utilizator" checked={cats.functional} onChange={v => setCats({ ...cats, functional: v })} />
                <CategoryRow label="Marketing"   sub="atribuire campanii"    checked={cats.marketing}   onChange={v => setCats({ ...cats, marketing: v })} />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!showDetails ? (
                <>
                  <button onClick={() => setShowDetails(true)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    Personalizează
                  </button>
                  <button onClick={acceptEssential}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    Doar esențiale
                  </button>
                  <button onClick={acceptAll}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer flex-1"
                    style={{ background: 'var(--red)', color: 'white' }}>
                    Acceptă tot
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowDetails(false)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                    ← Înapoi
                  </button>
                  <button onClick={saveSelection}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer flex-1"
                    style={{ background: 'var(--red)', color: 'white' }}>
                    Salvează preferințele
                  </button>
                </>
              )}
            </div>
          </div>
          <button onClick={acceptEssential} aria-label="Închide"
            className="text-current opacity-30 hover:opacity-100 transition-opacity p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ label, sub, checked, disabled, onChange }: {
  label: string; sub: string; checked: boolean; disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        aria-label={`${checked ? 'Dezactivează' : 'Activează'} ${label}`}
        className="flex items-center justify-center w-5 h-5 rounded flex-shrink-0 mt-0.5 cursor-pointer disabled:cursor-not-allowed"
        style={{
          background: checked ? 'var(--red)' : 'white',
          border: `1px solid ${checked ? 'var(--red)' : 'var(--border)'}`,
        }}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{label}</div>
        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub}</div>
      </div>
    </div>
  );
}
