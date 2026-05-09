/**
 * Consent helpers — single source of truth for cookie-banner state.
 *
 * Source of truth on the client is the `sf_consent` first-party cookie. This
 * module exposes a tiny API used by the banner, by analytics loaders, and by
 * any component that needs to gate a third-party script.
 *
 * Bump CONSENT_VERSION when:
 *   - the privacy policy materially changes, OR
 *   - the cookie categories shape changes.
 * Existing visitors will then be re-prompted.
 */

export const CONSENT_VERSION = 1;
export const CONSENT_COOKIE = 'sf_consent';
export const CONSENT_LEGACY_LS = 'sf-cookie-consent-v1';
export const CONSENT_LEGACY_LEVEL = 'sf-cookie-consent-v1-level';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 12 months — ANSPDCP guidance for non-essential

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** Bumps when policy text or categories change — forces re-prompt. */
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

/** Read consent state. Returns null when the visitor hasn't decided yet. */
export function getConsent(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.version !== 'number'
    ) {
      return null;
    }
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

/** True when the given category is allowed. `necessary` is always true. */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const state = getConsent();
  if (!state || state.version !== CONSENT_VERSION) return false;
  return !!state[category];
}

/** Persist consent client-side (cookie + legacy mirrors + custom event). */
export function setConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({
    necessary: true,
    analytics: !!state.analytics,
    marketing: !!state.marketing,
    version: state.version || CONSENT_VERSION,
  });
  writeCookie(CONSENT_COOKIE, payload, COOKIE_MAX_AGE);

  // Backwards-compat: the existing Analytics component reads
  // localStorage `sf-cookie-consent-v1` and gates on `level === 'all'`.
  // Mirror the new state so we don't break it during the migration.
  try {
    const fauxLevel = state.analytics && state.marketing ? 'all' : 'essential';
    window.localStorage.setItem(
      CONSENT_LEGACY_LS,
      JSON.stringify({ ts: Date.now(), level: fauxLevel, cats: state }),
    );
    window.localStorage.setItem(CONSENT_LEGACY_LEVEL, fauxLevel);
  } catch { /* localStorage may be blocked */ }

  // Notify listeners (e.g. analytics loaders) that consent has changed.
  window.dispatchEvent(new CustomEvent('sf-consent', { detail: state }));
}
