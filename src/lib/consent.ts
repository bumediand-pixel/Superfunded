export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = 'sf_consent';
export const CONSENT_LEGACY_LS = 'sf-cookie-consent-v1';
export const CONSENT_LEGACY_LEVEL = 'sf-cookie-consent-v1-level';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
};

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function getConsent(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || typeof parsed.version !== 'number') return null;
    return { necessary: true, analytics: !!parsed.analytics, marketing: !!parsed.marketing, version: parsed.version };
  } catch {
    return null;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const state = getConsent();
  if (!state || state.version !== CONSENT_VERSION) return false;
  return !!state[category];
}

export function setConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({
    necessary: true,
    analytics: !!state.analytics,
    marketing: !!state.marketing,
    version: state.version || CONSENT_VERSION,
  });
  writeCookie(CONSENT_COOKIE, payload, COOKIE_MAX_AGE);
  try {
    const fauxLevel = state.analytics && state.marketing ? 'all' : 'essential';
    window.localStorage.setItem(CONSENT_LEGACY_LS, JSON.stringify({ ts: Date.now(), level: fauxLevel, cats: state }));
    window.localStorage.setItem(CONSENT_LEGACY_LEVEL, fauxLevel);
  } catch { /* localStorage may be blocked */ }
  window.dispatchEvent(new CustomEvent('sf-consent', { detail: state }));
}
