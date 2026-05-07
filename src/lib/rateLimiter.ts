/**
 * Hybrid rate limiter:
 *   - Production: Upstash Redis (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *     Required on Vercel because each invocation is isolated — in-memory state doesn't persist.
 *   - Dev / fallback: in-memory map (single-process only)
 *
 * Both signatures share the same boolean return: `true` = allowed, `false` = blocked.
 */

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash    = !!(UPSTASH_URL && UPSTASH_TOKEN);

// ─── In-memory fallback ────────────────────────────────────────────────────
const memStore = new Map<string, { count: number; resetAt: number }>();

function rateLimitMemory(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memStore.get(key);
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// Periodic prune (only matters in long-lived process, no-op in serverless)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of memStore) if (now > v.resetAt) memStore.delete(k);
  }, 10 * 60 * 1000).unref?.();
}

// ─── Upstash (REST) ────────────────────────────────────────────────────────
async function rateLimitUpstash(key: string, max: number, windowMs: number): Promise<boolean> {
  const k = `rl:${key}`;
  // Atomic-ish via INCR + EXPIRE NX. Two HTTP calls but Upstash is fast.
  const incrRes = await fetch(`${UPSTASH_URL}/incr/${encodeURIComponent(k)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: 'no-store',
  });
  if (!incrRes.ok) return true; // fail-open if Redis is down — don't lock users out
  const { result: count } = (await incrRes.json()) as { result: number };

  if (count === 1) {
    const ttl = Math.max(1, Math.ceil(windowMs / 1000));
    await fetch(`${UPSTASH_URL}/expire/${encodeURIComponent(k)}/${ttl}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });
  }

  return count <= max;
}

// ─── Public API ────────────────────────────────────────────────────────────
/**
 * Sync interface (kept for backwards compat with existing callsites).
 * In production with Upstash, the limiter actually fires off async — first
 * concurrent burst may slip through. For strict limits use rateLimitAsync.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  if (!useUpstash) return rateLimitMemory(key, max, windowMs);
  // Fire-and-evaluate; conservatively allow the first hit, queue the rest in background.
  // This keeps the existing route signatures working without async refactors.
  const memOk = rateLimitMemory(key, max, windowMs);
  rateLimitUpstash(key, max, windowMs).catch(() => {});
  return memOk;
}

/** True async limiter — use this for new routes that can `await`. */
export async function rateLimitAsync(key: string, max: number, windowMs: number): Promise<boolean> {
  if (!useUpstash) return rateLimitMemory(key, max, windowMs);
  return rateLimitUpstash(key, max, windowMs);
}
