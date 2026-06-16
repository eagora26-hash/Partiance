import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { track } from '@/services/analytics';
import { computeMatch, type MatchCandidate, type Personality } from './algorithm';

/**
 * Matching service — orchestrates the deterministic algorithm against real data.
 * Loads candidate pools from Postgres, scores them, persists Match rows, and
 * returns explained results. The algorithm itself stays pure (algorithm.ts).
 */

type ProfileRow = {
  userId: string;
  city: string | null;
  availability: string | null;
  personality: unknown;
  skills: { skillId: string }[];
  goals: { goalId: string }[];
  industries: { industryId: string }[];
};

function toCandidate(p: ProfileRow): MatchCandidate {
  return {
    skillIds: p.skills.map((s) => s.skillId),
    goalIds: p.goals.map((g) => g.goalId),
    industryIds: p.industries.map((i) => i.industryId),
    availability: p.availability,
    personality: (p.personality as Personality | null) ?? null,
    city: p.city,
  };
}

const profileInclude = {
  skills: { select: { skillId: true } },
  goals: { select: { goalId: true } },
  industries: { select: { industryId: true } },
} as const;

/**
 * Generate (or refresh) matches for a user against the candidate pool.
 * Upserts Match rows so re-running is idempotent and scores stay current.
 */
export async function generateMatchesForUser(userId: string, limit = 20): Promise<number> {
  const me = await db.profile.findUnique({
    where: { userId },
    select: { userId: true, city: true, availability: true, personality: true, ...profileInclude },
  });
  if (!me) {
    logger.warn('matching.no_profile', { userId });
    return 0;
  }

  // Candidate pool: every other user who finished onboarding.
  const pool = await db.profile.findMany({
    where: { userId: { not: userId }, onboardingCompleted: true },
    select: { userId: true, city: true, availability: true, personality: true, ...profileInclude },
    take: 200, // cap the pool; ranking happens in-memory
  });

  const meCandidate = toCandidate(me);
  const scored = pool
    .map((p) => {
      const result = computeMatch(meCandidate, toCandidate(p));
      return { targetId: p.userId, ...result };
    })
    .filter((m) => m.score >= 40) // only surface meaningful matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Persist BOTH directions (compatibility is symmetric, so when this user
  // joins, the counterpart should immediately see them too — this powers the
  // "missed connection" recovery loop in PRODUCT_RUNTIME_FLOWS). Idempotent
  // upsert on the unique [sourceId, targetId].
  await Promise.all(
    scored.flatMap((m) => [
      db.match.upsert({
        where: { sourceId_targetId: { sourceId: userId, targetId: m.targetId } },
        create: { sourceId: userId, targetId: m.targetId, score: m.score, breakdown: m.breakdown, reasons: m.reasons },
        update: { score: m.score, breakdown: m.breakdown, reasons: m.reasons },
      }),
      db.match.upsert({
        where: { sourceId_targetId: { sourceId: m.targetId, targetId: userId } },
        create: { sourceId: m.targetId, targetId: userId, score: m.score, breakdown: m.breakdown, reasons: m.reasons },
        update: { score: m.score, breakdown: m.breakdown, reasons: m.reasons },
      }),
    ])
  );

  await track('match_generated', { userId, metadata: { count: scored.length } });
  logger.info('matching.generated', { userId, count: scored.length });
  return scored.length;
}

/** Read a user's matches (for dashboard / explore), highest score first. */
export async function getMatchesForUser(userId: string, limit = 12) {
  return db.match.findMany({
    where: { targetId: userId },
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      score: true,
      breakdown: true,
      reasons: true,
      status: true,
      source: {
        select: {
          id: true,
          name: true,
          profile: { select: { headline: true, city: true, persona: true } },
        },
      },
    },
  });
}
