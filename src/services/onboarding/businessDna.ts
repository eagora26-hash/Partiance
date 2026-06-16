import type { PersonaType } from '@prisma/client';
import type { Personality } from '@/lib/validations/onboarding';

/**
 * Business DNA + Founder Type derivation (ONBOARDING_SYSTEM.md → "AI Analysis").
 * Deterministic profiling from persona + personality so every user gets an
 * immediate, explainable result (the "first value moment"). i18n keys, never text.
 */

export type BusinessDna = {
  founderType: string; // i18n key, e.g. dna.founderType.visionary
  archetypeKey: string;
  traits: string[]; // i18n keys for top traits
  summaryKey: string;
};

const FOUNDER_TYPE_BY_PERSONA: Record<PersonaType, string> = {
  FOUNDER: 'visionary',
  INVESTOR: 'backer',
  DEVELOPER: 'builder',
  DESIGNER: 'craftsman',
  FREELANCER: 'specialist',
  AGENCY: 'operator',
  MENTOR: 'guide',
};

export function deriveBusinessDna(persona: PersonaType, p: Personality): BusinessDna {
  // Refine the base persona type with the dominant personality signal.
  let founderType = FOUNDER_TYPE_BY_PERSONA[persona];

  const traits: string[] = [];
  if (p.risk >= 65) traits.push('dna.trait.boldRiskTaker');
  else if (p.risk <= 35) traits.push('dna.trait.measured');

  if (p.conscientiousness >= 65) traits.push('dna.trait.executor');
  if (p.openness >= 65) traits.push('dna.trait.innovator');
  if (p.extraversion >= 65) traits.push('dna.trait.connector');
  else if (p.extraversion <= 35) traits.push('dna.trait.focused');
  if (p.agreeableness >= 65) traits.push('dna.trait.collaborator');

  // Nudge founder type when a strong signal overrides the persona default.
  if (persona === 'FOUNDER' && p.openness >= 70 && p.risk >= 70) founderType = 'visionary';
  if (persona === 'FOUNDER' && p.conscientiousness >= 70 && p.risk < 50) founderType = 'operator';

  return {
    founderType: `dna.founderType.${founderType}`,
    archetypeKey: `dna.archetype.${founderType}`,
    traits: traits.slice(0, 4),
    summaryKey: `dna.summary.${founderType}`,
  };
}
