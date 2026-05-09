'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';
import {
  getConsent,
  setConsent,
  CONSENT_VERSION,
  type ConsentState,
} from '@/lib/consent';

type Lang = 'ro' | 'en';

const COPY: Record<Lang, {
  title: string;
  body: string;
  details: string;
  necessary: { label: string; sub: string };
  analytics: { label: string; sub: string };
  marketing: { label: string; sub: string };
  customize: string;
  essential: string;
  acceptAll: string;
  back: string;
  save: string;
  detailsLink: string;
}> = {
  ro: {
    title: 'Cookies pe SuperFunded',
    body:
      'Folosim cookies pentru autentificare, performanță și marketing. Cookie-urile esențiale sunt obligatorii. Pentru analytics și marketing îți cerem consimțământul.',
    details: 'Detalii',
    necessary: { label: 'Necesare', sub: 'auth, plată, KYC — obligatorii (nu pot fi dezactivate)' },
    analytics: { label: 'Analitice', sub: 'măsurare anonimă a utilizării (GA, Vercel Analytics)' },
    marketing: { label: 'Marketing', sub: 'atribuire campanii, retargeting (Meta Pixel)' },
    customize: 'Personalizează',
    essential: 'Doar necesare',
    acceptAll: 'Acceptă tot',
    back: '← Înapoi',
    save: 'Salvează preferințele',
    detailsLink: '/politica-confidentialitate',
  },
  en: {
    title: 'Cookies on SuperFunded',
    body:
      'We use cookies for authentication, performance and marketing. Necessary cookies are required. We ask consent for analytics and marketing.',
    details: 'Details',
    necessary: { label: 'Necessary', sub: 'auth, payment, KYC — required (cannot be disabled)' },
    analytics: { label: 'Analytics', sub: 'anonymous usage measurement (GA, Vercel Analytics)' },
    marketing: { label: 'Marketing', sub: 'campaign attribution, retargeting (Meta Pixel)' },
    customize: 'Customize',
    essential: 'Necessary only',
    acceptAll: 'Accept all',
    back: '← Back',
    save: 'Save preferences',
    detailsLink: '/politica-confidentialitate',
  },
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [lang, setLang] = useState<Lang>('ro');
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const c = getConsent();
    if (!c || c.v !== CONSENT_VERSION) {
      setVisible(true);
    }
  }, []);

  const persist = async (a: boolean, m: boolean) => {
    const next: ConsentState = setConsent({ a, m });
    setVisible(false);
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          necessary: true,
          analytics: next.a,
          marketing: next.m,
          version: next.v,
        }),
        keepalive: true,
      });
    } catch {
      // Silent fail — client cookie is the source of truth.
    }
  };

  const acceptAll = () => persist(true, true);
  const acceptEssential = () => persist(false, false);
  const saveSelection = () => persist(analytics, marketing);

  if (!visible) return null;

  const t = COPY[lang];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-6 md:bottom-6 md:max-w-md">
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
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-extrabold text-sm" style={{ color: 'var(--text)' }}>
                {t.title}
              </h3>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setLang('ro')}
                  className="px-1.5 py-0.5 rounded cursor-pointer"
                  style={{
                    background: lang === 'ro' ? 'var(--red)' : 'transparent',
                    color: lang === 'ro' ? 'white' : 'var(--text-muted)',
                  }}
                  aria-pressed={lang === 'ro'}
                >
                  RO
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className="px-1.5 py-0.5 rounded cursor-pointer"
                  style={{
                    background: lang === 'en' ? 'var(--red)' : 'transparent',
                    color: lang === 'en' ? 'white' : 'var(--text-muted)',
                  }}
                  aria-pressed={lang === 'en'}
                >
                  EN
                </button>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
              {t.body}{' '}
              <Link
                href={t.detailsLink}
                className="font-semibold hover:underline"
                style={{ color: 'var(--red)' }}
              >
                {t.details}
              </Link>
            </p>

            {showDetails && (
              <div className="space-y-2 mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-alt2)' }}>
                <CategoryRow label={t.necessary.label} sub={t.necessary.sub} checked disabled />
                <CategoryRow
                  label={t.analytics.label}
                  sub={t.analytics.sub}
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  label={t.marketing.label}
                  sub={t.marketing.sub}
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!showDetails ? (
                <>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.customize}
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.essential}
                  </button>
                  <button
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
                    onClick={() => setShowDetails(false)}
                    className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                    style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
                  >
                    {t.back}
                  </button>
                  <button
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
            onClick={acceptEssential}
            aria-label={lang === 'ro' ? 'Închide' : 'Close'}
            className="text-current opacity-30 hover:opacity-100 transition-opacity p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
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
        <div className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>
          {label}
        </div>
        <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      </div>
    </div>
  );
}
