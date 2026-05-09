/**
 * Rate-limit policies backed by Upstash Redis (sliding window).
 *
 * Each policy is a separate `Ratelimit` instance with its own window/limit so
 * we can tune them independently. Identifiers are typically IPs or user IDs;
 * routes that have authenticated users SHOULD pass `user:<id>` for fairness
 * across NATs / shared egress IPs.
 *
 * If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are missing we fall
 * back to a per-process in-memory limiter — this keeps `next dev` working
 * without Redis but provides NO protection in production (each Lambda is
 * isolated). The proxy logs a warning at boot when this happens.
 *
 * Returned shape mirrors `@upstash/ratelimit`'s `limit()` so callers can
 * uniformly read `success`, `limit`, `remaining`, `reset`.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

let warned = false;
function warnNoRedis() {
  if (warned) return;
  warned = true;
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing in production — falling back to in-memory limiter (NOT SAFE).'
    );
  } else {
    console.warn('[ratelimit] Upstash creds missing — using in-memory fallback (dev only).');
  }
}

const redis: Redis | null = hasRedis
  ? new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! })
  : null;

/** Build a sliding-window limiter in front of Upstash. */
function build(prefix: string, limit: number, windowSec: number): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: `rl:${prefix}`,
    analytics: true,
  });
}

// ─── In-memory fallback ────────────────────────────────────────────────────
// Per-prefix maps so policies don't collide. Single-process only; adequate
// for `next dev` and unit tests.
type Bucket = { count: number; resetAt: number };
const memBuckets = new Map<string, Map<string, Bucket>>();

function memLimit(prefix: string, id: string, limit: number, windowMs: number): LimitResult {
  let store = memBuckets.get(prefix);
  if (!store) {
    store = new Map();
    memBuckets.set(prefix, store);
  }
  const now = Date.now();
  const entry = store.get(id);
  if (!entry || now > entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }
  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetAt };
  }
  entry.count++;
  return { success: true, limit, remaining: limit - entry.count, reset: entry.resetAt };
}

// ─── Policies ──────────────────────────────────────────────────────────────
// 5 requests / 15 minutes / IP — protects /api/auth/* against credential stuffing.
const authLimiter = build('auth', 5, 15 * 60);
// 3 withdrawals / hour / user — anti-fraud + ops sanity.
const withdrawalLimiter = build('retrageri', 3, 60 * 60);
// 30 bets / minute / user — keeps a runaway client from spamming the bet engine.
const betsLimiter = build('bets', 30, 60);
// 100 requests / minute / IP default — coarse global cap for everything else.
const defaultLimiter = build('default', 100, 60);

const POLICY_DEFS = {
  auth:        { limit: 5,   windowMs: 15 * 60 * 1000 },
  retrageri:   { limit: 3,   windowMs: 60 * 60 * 1000 },
  bets:        { limit: 30,  windowMs: 60 * 1000 },
  default:     { limit: 100, windowMs: 60 * 1000 },
} as const;

export type LimitPolicy = keyof typeof POLICY_DEFS;

const POLICY_INSTANCES: Record<LimitPolicy, Ratelimit | null> = {
  auth:        authLimiter,
  retrageri:   withdrawalLimiter,
  bets:        betsLimiter,
  default:     defaultLimiter,
};

/**
 * Apply a named policy. `identifier` should be IP for unauthenticated routes
 * and `user:<id>` (or similar) for authenticated routes.
 */
export async function rateLimit(policy: LimitPolicy, identifier: string): Promise<LimitResult> {
  const def = POLICY_DEFS[policy];
  const ltr = POLICY_INSTANCES[policy];
  if (!ltr) {
    warnNoRedis();
    return memLimit(policy, identifier, def.limit, def.windowMs);
  }
  const r = await ltr.limit(identifier);
  return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
}

/** Pick the best client identifier from a Next request. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

/** Build the standard rate-limit response headers. */
export function rateLimitHeaders(r: LimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(r.limit),
    'X-RateLimit-Remaining': String(Math.max(0, r.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(r.reset / 1000)),
  };
}
