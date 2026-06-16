import { logger } from './logger';

/**
 * Lightweight fixed-window rate limiter (anti-abuse, SECURITY_RULES).
 * In-memory for single-instance/dev; swap the store for Redis at scale
 * without changing call sites (the function signature is the contract).
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export type RateLimitResult = { success: boolean; remaining: number; resetAt: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    logger.warn('rate_limit.exceeded', { key, limit });
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }
  return { success: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// Periodic cleanup so the map doesn't grow unbounded.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
  }, 60_000).unref?.();
}
