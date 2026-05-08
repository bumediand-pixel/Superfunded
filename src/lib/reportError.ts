/**
 * Lightweight error reporter — front-side hook for Sentry / posthog / your-pick.
 * Drops the dependency on a specific SDK; consumers can pipe to whichever
 * monitoring backend they configure via env.
 *
 * Usage:
 *   import { reportError } from '@/lib/reportError';
 *   try { ... } catch (err) { reportError(err, { route: '/api/foo' }); }
 *
 * To enable Sentry: `npm i @sentry/nextjs`, run `npx @sentry/wizard@latest -i nextjs`,
 * then this helper picks up automatically because Sentry overrides global console.error.
 */

type Context = Record<string, unknown>;

declare global {
  // eslint-disable-next-line no-var
  var __sentryReport: ((err: unknown, ctx?: Context) => void) | undefined;
}

export function reportError(err: unknown, ctx?: Context) {
  // 1. Always log to console (picked up by Vercel + Sentry's console wrapper).
  console.error('[reportError]', err, ctx);

  // 2. If a Sentry-style hook is registered globally, fire it.
  if (typeof globalThis.__sentryReport === 'function') {
    try { globalThis.__sentryReport(err, ctx); } catch { /* swallow */ }
  }

  // 3. Optional: ping a webhook (e.g. Discord ops channel) for severe errors.
  const hook = process.env.ERROR_WEBHOOK_URL;
  if (hook && typeof fetch === 'function') {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `🔴 **Error**\n\`${message}\`\n\`\`\`json\n${JSON.stringify(ctx ?? {}, null, 2).slice(0, 1500)}\n\`\`\`` }),
    }).catch(() => {});
  }
}
