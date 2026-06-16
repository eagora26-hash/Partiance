import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { track } from '@/services/analytics';
import { generateMatchesForUser } from '@/services/matching/matching.service';
import { deriveBusinessDna, type BusinessDna } from './businessDna';
import type { OnboardingInput } from '@/lib/validations/onboarding';

export type ServiceResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

/** Reference taxonomy for the wizard (bilingual labels resolved client-side by locale). */
export async function getOnboardingReferenceData() {
  const [skills, goals, industries] = await Promise.all([
    db.skill.findMany({ orderBy: { nameIt: 'asc' }, select: { id: true, slug: true, nameIt: true, nameEn: true } }),
    db.goal.findMany({ orderBy: { nameIt: 'asc' }, select: { id: true, slug: true, nameIt: true, nameEn: true } }),
    db.industry.findMany({ orderBy: { nameIt: 'asc' }, select: { id: true, slug: true, nameIt: true, nameEn: true } }),
  ]);
  return { skills, goals, industries };
}

export async function getProfileState(userId: string) {
  return db.profile.findUnique({
    where: { userId },
    select: { onboardingStep: true, onboardingCompleted: true, persona: true },
  });
}

/**
 * Complete onboarding: validate referenced ids exist, persist the full profile
 * (persona, location, availability, skills/goals/industries, personality),
 * derive Business DNA, mark complete, then kick off match generation.
 * Wrapped in a transaction for the profile write; matching runs after commit.
 */
export async function completeOnboarding(
  userId: string,
  input: OnboardingInput
): Promise<ServiceResult<{ dna: BusinessDna; matchCount: number }>> {
  // Validate referenced taxonomy ids actually exist (defence against tampering).
  const [skillCount, goalCount, industryCount] = await Promise.all([
    db.skill.count({ where: { id: { in: input.skillIds } } }),
    db.goal.count({ where: { id: { in: input.goalIds } } }),
    db.industry.count({ where: { id: { in: input.industryIds } } }),
  ]);
  if (
    skillCount !== input.skillIds.length ||
    goalCount !== input.goalIds.length ||
    industryCount !== input.industryIds.length
  ) {
    return { ok: false, error: 'invalid_reference' };
  }

  const dna = deriveBusinessDna(input.persona, input.personality);

  await db.$transaction(async (tx) => {
    const { id: pid } = await tx.profile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    // Reset join rows so re-running onboarding is idempotent.
    await tx.profileSkill.deleteMany({ where: { profileId: pid } });
    await tx.profileGoal.deleteMany({ where: { profileId: pid } });
    await tx.profileIndustry.deleteMany({ where: { profileId: pid } });

    await tx.profile.update({
      where: { userId },
      data: {
        persona: input.persona,
        city: input.city,
        availability: input.availability,
        headline: input.headline ?? null,
        personality: input.personality,
        businessDna: dna as object,
        onboardingStep: 5,
        onboardingCompleted: true,
        trustScore: 20, // baseline for completing onboarding
        builderScore: 10,
        skills: { create: input.skillIds.map((skillId) => ({ skillId })) },
        goals: { create: input.goalIds.map((goalId) => ({ goalId })) },
        industries: { create: input.industryIds.map((industryId) => ({ industryId })) },
      },
    });
  });

  await track('onboarding_completed', { userId, metadata: { persona: input.persona } });
  logger.info('onboarding.completed', { userId, founderType: dna.founderType });

  // Generate matches now so the user lands on a populated dashboard (first value moment).
  let matchCount = 0;
  try {
    matchCount = await generateMatchesForUser(userId);
  } catch (err) {
    logger.error('onboarding.match_generation_failed', { userId, error: (err as Error).message });
  }

  return { ok: true, data: { dna, matchCount } };
}

/** Lightweight save of a single step (resume support). */
export async function saveStep(userId: string, step: number): Promise<void> {
  await db.profile.update({ where: { userId }, data: { onboardingStep: Math.max(0, Math.min(5, step)) } });
}
