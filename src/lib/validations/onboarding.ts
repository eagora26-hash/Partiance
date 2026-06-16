import { z } from 'zod';

/** Onboarding validation (ONBOARDING_SYSTEM.md — 5 steps). */

export const personaSchema = z.enum([
  'FOUNDER',
  'INVESTOR',
  'DEVELOPER',
  'DESIGNER',
  'FREELANCER',
  'AGENCY',
  'MENTOR',
]);

export const availabilitySchema = z.enum(['FULL_TIME', 'PART_TIME', 'WEEKENDS', 'OCCASIONAL']);

// Big-five-style personality sliders, 0..100 each.
export const personalitySchema = z.object({
  openness: z.coerce.number().min(0).max(100),
  conscientiousness: z.coerce.number().min(0).max(100),
  extraversion: z.coerce.number().min(0).max(100),
  agreeableness: z.coerce.number().min(0).max(100),
  risk: z.coerce.number().min(0).max(100), // risk appetite
});

export const onboardingSchema = z.object({
  persona: personaSchema,
  city: z.string().trim().min(2, 'city_required').max(80),
  availability: availabilitySchema,
  skillIds: z.array(z.string().cuid()).min(1, 'skills_required').max(12),
  goalIds: z.array(z.string().cuid()).min(1, 'goals_required').max(8),
  industryIds: z.array(z.string().cuid()).min(1, 'industries_required').max(6),
  personality: personalitySchema,
  headline: z.string().trim().max(120).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type Personality = z.infer<typeof personalitySchema>;
