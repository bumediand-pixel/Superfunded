/**
 * Edge-safe rate limiters built on @upstash/ratelimit + @upstash/redis.
 *
 * Why a new file alongside the existing `rateLimiter.ts`?
 *   * The legacy helper is sync and tied to in-memory fallback semantics —
 *     callsites in /api/retrageri etc. still depend on it.
 *   * Proxy (Edge runtime) needs proper async sliding-window limiters with a
 *     real distributed store. This file is the canonical limiter for the new
 *     proxy.ts and any newly-written routes.
 *
 * If Upstash env vars are not set we export a no-op limiter that always allows
 * — safer for local dev than a hard failure. Production MUST set both vars.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const enabled = !!(UPSTASH_URL && UPSTASH_TOKEN);

const redis = enabled
  ? new Redis({ url: UPSTASH_URL!, token: UPSTASH_TOKEN! })
  : null;

export type LimitDecision = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // ms epoch
};

const ALLOW: LimitDecision = { success: true, limit: 0, remaining: 0, reset: 0 };

function build(prefix: string, max: number, window: `${number} ${'s'|'m'|'h'|'d'}`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `sf:rl:${prefix}`,
    analytics: false,
  });
}

export const limiters = {
  /** /api/auth/* — 5 per 15 min per IP. Brute-force / stuffing guard. */
  auth:        build('auth',         5,  '15 m'),
  /** /api/retrageri — 3 per hour per user. Money-out endpoint, deliberately strict. */
  withdrawals: build('withdrawals',  3,  '1 h'),
  /** /api/bets — 30 per minute per user. */
  bets:        build('bets',         30, '1 m'),
  /** Default global IP limiter — 100 / minute. */
  default:     build('default',      100,'1 m'),
};

export async function check(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<LimitDecision> {
  if (!limiter) return ALLOW;
  const r = await limiter.limit(identifier);
  return {
    success: r.success,
    limit: r.limit,
    remaining: r.remaining,
    reset: r.reset,
  };
}

/** Best-effort client IP extraction in Edge / Node runtime. */
export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

/** Adds standard RateLimit-* response headers when blocking. */
export function rateLimitHeaders(d: LimitDecision): HeadersInit {
  return {
    'X-RateLimit-Limit':     String(d.limit),
    'X-RateLimit-Remaining': String(Math.max(0, d.remaining)),
    'X-RateLimit-Reset':     String(Math.ceil(d.reset / 1000)),
    'Retry-After':           String(Math.max(1, Math.ceil((d.reset - Date.now()) / 1000))),
  };
}
