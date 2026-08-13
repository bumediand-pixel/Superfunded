/**
 * Privacy-first analytics. Renders only when:
 *   - NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, AND
 *   - User accepted "all" cookies (sf-cookie-consent-v1 → level: 'all')
 *
 * No PII collected; no third-party tracking pixels.
 */
'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const HOST   = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || 'https://plausible.io';

export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => {
      try {
        const raw = window.localStorage.getItem('sf-cookie-consent-v1');
        if (!raw) return setAllowed(false);
        const parsed = JSON.parse(raw);
        setAllowed(parsed.level === 'all');
      } catch { setAllowed(false); }
    };
    check();
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ level: string }>).detail;
      setAllowed(detail.level === 'all');
    };
    window.addEventListener('sf-consent', onConsent);
    return () => window.removeEventListener('sf-consent', onConsent);
  }, []);

  if (!DOMAIN || !allowed) return null;
  return (
    <Script
      defer
      strategy="afterInteractive"
      data-domain={DOMAIN}
      src={`${HOST}/js/script.js`}
    />
  );
}
