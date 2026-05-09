'use client';
/**
 * GDPR cookie banner — three categories: necessary (always on), analytics, marketing.
 *
 * - Persists consent in a first-party cookie `sf_consent` with the JSON shape
 *   { n: true, a: boolean, m: boolean, v: number } (`v` = consent version).
 * - Also POSTs the same payload to /api/consent so we have an auditable
 *   server-side record (per ANSPDCP guidance, consent must be demonstrable).
 * - For backwards compatibility with the existing Analytics component
 *   (which reads `sf-cookie-consent-v1` from localStorage), we mirror the
 *   accept-all decision into that legacy key. New code should call
 *   `hasConsent('analytics' | 'marketing')` from `@/lib/consent` instead.
 * - Includes a simple RO/EN switcher because the marketing site occasionally
 *   serves international visitors during ONJN clarification phase.
 * - Blocks GA / Meta loading until consent: any third-party tracker should
 *   import `hasConsent` and short-circuit if false.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';
import { CONSENT_VERSION, getConsent, setConsent, type ConsentState } from '@/lib/consent';

type Lang = 'ro' | 'en';

const COPY: Record<Lang, {
  title: string;
  body: string;
  details: string;
  acceptAll: string;
  acceptEssential: string;
  customize: string;
  back: string;
  save: string;
  catNecessary: string;
  catNecessarySub: string;
  catAnalytics: string;
  catAnalyticsSub: string;
  catMarketing: string;
  catMarketingSub: string;
  closeLabel: string;
  privacy: string;
}> = {
  ro: {
    title: 'Cookies pe SuperFunded',
    body: 'Folosim cookies pentru autentificare, analytics anonime și marketing. Poți alege ce categorii activezi.',
    details: 'Detalii',
    acceptAll: 'Acceptă tot',
    acceptEssential: 'Doar esențiale',
    customize: 'Personalizează',
    back: '← Înapoi',
    save: 'Salvează preferințele',
    catNecessary: 'Necesare',
    catNecessarySub: 'auth, plată, KYC — obligatorii',
    catAnalytics: 'Analytics',
    catAnalyticsSub: 'măsurăm trafic agregat (anonim)',
    catMarketing: 'Marketing',
    catMarketingSub: 'remarketing și atribuire campanii',
    closeLabel: 'Închide',
    privacy: 'Politica de Confidențialitate',
  },
  en: {
    title: 'Cookies on SuperFunded',
    body: 'We use cookies for authentication, anonymous analytics and marketing. Choose which categories you enable.',
    details: 'Details',
    acceptAll: 'Accept all',
    acceptEssential: 'Only essential',
    customize: 'Customize',
    back: '← Back',
    save: 'Save preferences',
    catNecessary: 'Necessary',
    catNecessarySub: 'auth, payments, KYC — required',
    catAnalytics: 'Analytics',
    catAnalyticsSub: 'aggregate (anonymous) traffic',
    catMarketing: 'Marketing',
    catMarketingSub: 'remarketing and campaign attribution',
    closeLabel: 'Close',
    privacy: 'Privacy Policy',
  },
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [lang, setLang] = useState<Lang>('ro');
  const t = useMemo(() => COPY[lang], [lang]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Detect lang preference: ?lang=en query, then <html lang>, default ro.
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('lang');
      if (q === 'en' || q === 'ro') setLang(q);
      else if (document.documentElement.lang?.toLowerCase().startsWith('en')) setLang('en');
    } catch { /* noop */ }

    const existing = getConsent();
    if (!existing || existing.version !== CONSENT_VERSION) {
      setVisible(true);
    }
  }, []);

  const persist = async (state: ConsentState) => {
    setConsent(state);
    setVisible(false);
    try {
      await fetch('/api/consent', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch {
      // Network failures are non-fatal — the cookie is the source of truth
      // for client-side gating. The /api/consent record is audit-only.
    }
  };

  const acceptAll = () => persist({
    necessary: true, analytics: true, marketing: true, version: CONSENT_VERSION,
  });
  const acceptEssential = () => persist({
    necessary: true, analytics: false, marketing: false, version: CONSENT_VERSION,
  });
  const saveSelection = () => persist({
    necessary: true, analytics, marketing, version: CONSENT_VERSION,
  });

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="sf-cookie-title"
      className="fixed bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: '#fff1f2' }}
          >
            <Cookie className="w-5 h-5" style={{ color: 'var(--red)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 id="sf-cookie-title" className="font-extrabold text-sm" style={{ color: 'var(--text)' }}>
                {t.title}
              </h3>
              <LangSwitch lang={lang} onChange={setLang} />
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              {t.body}{' '}
              <Link
                href="/politica-confidentialitate"
                className="font-semibold hover:underline"
                style={{ color: 'var(--red)' }}
              >
                {t.details}
              </Link>
            </p>

            {showDetails && (
              <div className="space-y-2 mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-alt2)' }}>
                <CategoryRow label={t.catNecessary} sub={t.catNecessarySub} checked disabled />
                <CategoryRow
                  label={t.catAnalytics}
                  sub={t.catAnalyticsSub}
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  label={t.catMarketing}
                  sub={t.catMarketingSub}
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!showDetails ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.customize}
                  </button>
                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.acceptEssential}
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer flex-1"
                    style={{ background: 'var(--red)', color: 'white' }}
                  >
                    {t.acceptAll}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={saveSelection}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer flex-1"
                    style={{ background: 'var(--red)', color: 'white' }}
                  >
                    {t.save}
                  </button>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={acceptEssential}
            aria-label={t.closeLabel}
            className="text-current opacity-30 hover:opacity-100 transition-opacity p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-1 text-[10px] font-bold tracking-wider"
      style={{ color: 'var(--text-muted)' }}
    >
      {(['ro', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className="px-1.5 py-0.5 rounded cursor-pointer"
          style={{
            background: lang === l ? 'var(--red)' : 'transparent',
            color: lang === l ? 'white' : 'var(--text-muted)',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function CategoryRow({
  label,
  sub,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  disabled?: boolean;
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
        }}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{label}</div>
        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{sub}</div>
      </div>
    </div>
  );
}
