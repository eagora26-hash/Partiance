'use server';

import { requireUser } from '@/lib/auth/session';
import { onboardingSchema } from '@/lib/validations/onboarding';
import { completeOnboarding, saveStep } from '@/services/onboarding/onboarding.service';
import type { BusinessDna } from '@/services/onboarding/businessDna';
import { logger } from '@/lib/logger';

export type OnboardingState = {
  ok: boolean;
  error?: string;
  dna?: BusinessDna;
  matchCount?: number;
};

/**
 * Submit the full onboarding payload. The wizard collects all steps client-side
 * then commits once (≤3 min target, single transaction). Server re-validates
 * everything — never trust client-built ids.
 */
export async function submitOnboardingAction(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const user = await requireUser();

  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get('payload') ?? '{}'));
  } catch {
    return { ok: false, error: 'validation_error' };
  }

  const parsed = onboardingSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn('onboarding.invalid', { userId: user.id, issues: parsed.error.issues.length });
    return { ok: false, error: 'validation_error' };
  }

  const result = await completeOnboarding(user.id, parsed.data);
  if (!result.ok) return { ok: false, error: result.error };

  return { ok: true, dna: result.data.dna, matchCount: result.data.matchCount };
}

/** Persist current step for resume support (non-blocking, best-effort). */
export async function saveStepAction(step: number): Promise<void> {
  try {
    const user = await requireUser();
    await saveStep(user.id, step);
  } catch (err) {
    logger.warn('onboarding.save_step_failed', { error: (err as Error).message });
  }
}
