import { db } from '@/lib/db';
import { env, features } from '@/lib/env';
import { logger } from '@/lib/logger';

/**
 * Analytics / event tracking (METRICS_AND_EVENTS_SYSTEM.md).
 *
 * Events are ALWAYS persisted to our own `activity_logs` table (real audit trail,
 * queryable, owned by us). When PostHog is configured, events are ALSO forwarded
 * for product analytics. This is a real dual-write, never a no-op.
 */
export type TrackPayload = {
  userId?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  ip?: string;
};

export async function track(event: string, payload: TrackPayload = {}): Promise<void> {
  // 1) Durable audit log (always).
  try {
    await db.activityLog.create({
      data: {
        event,
        userId: payload.userId ?? null,
        metadata: (payload.metadata ?? undefined) as object | undefined,
        sessionId: payload.sessionId ?? null,
        ip: payload.ip ?? null,
      },
    });
  } catch (err) {
    logger.error('analytics.persist_failed', { event, error: (err as Error).message });
  }

  // 2) Forward to PostHog when configured.
  if (features.posthog && payload.userId) {
    try {
      await fetch(`${env.NEXT_PUBLIC_POSTHOG_HOST}/capture/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: env.NEXT_PUBLIC_POSTHOG_KEY,
          event,
          distinct_id: payload.userId,
          properties: payload.metadata ?? {},
        }),
      });
    } catch (err) {
      logger.warn('analytics.posthog_failed', { event, error: (err as Error).message });
    }
  }
}
