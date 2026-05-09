// Compliance: GDPR consent helpers.
// Stores user choice in cookie `sf_consent` so SSR/middleware can read it
// without depending on localStorage. Mirrors to localStorage for client perf.

export const CONSENT_COOKIE = 'sf_consent';
export const CONSENT_VERSION = '2026-05-09';
export const CONSENT_LS_KEY = 'sf_consent';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export type ConsentState = {
  n: true;
  a: boolean;
  m: boolean;
  v: string; // version
  t: number; // timestamp ms
};

export const DEFAULT_CONSENT: ConsentState = {
  n: true,
  a: false,
  m: false,
  v: CONSENT_VERSION,
  t: 0,
};

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

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  // Try cookie first (canonical) then LS as fallback.
  const raw = readCookie(CONSENT_COOKIE) ?? window.localStorage.getItem(CONSENT_LS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentState;
    if (!parsed || parsed.n !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const c = getConsent();
  if (!c) return false;
  if (category === 'analytics') return Boolean(c.a);
  if (category === 'marketing') return Boolean(c.m);
  return false;
}

export function setConsent(state: Pick<ConsentState, 'a' | 'm'>): ConsentState {
  const next: ConsentState = {
    n: true,
    a: Boolean(state.a),
    m: Boolean(state.m),
    v: CONSENT_VERSION,
    t: Date.now(),
  };
  const json = JSON.stringify(next);
  writeCookie(CONSENT_COOKIE, json, 60 * 60 * 24 * 365); // 1 year
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CONSENT_LS_KEY, json);
    window.dispatchEvent(new CustomEvent('sf-consent', { detail: next }));
  }
  return next;
}
