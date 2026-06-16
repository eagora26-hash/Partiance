import { z } from 'zod';

/** Project validation (DATABASE_ARCHITECTURE: projects + lookingFor + budget). */

export const projectStageSchema = z.enum(['IDEA', 'MVP', 'STARTUP', 'SCALING']);
export const lookingForSchema = z.enum(['COFOUNDER', 'INVESTOR', 'COLLABORATOR', 'MENTOR']);

export const projectInputSchema = z.object({
  title: z.string().trim().min(4, 'title_too_short').max(100, 'title_too_long'),
  description: z.string().trim().min(20, 'description_too_short').max(2000, 'description_too_long'),
  stage: projectStageSchema,
  lookingFor: z.array(lookingForSchema).min(1, 'looking_for_required').max(4),
  // Budget entered in euros (UI), stored as cents. Optional.
  budgetEuros: z.coerce.number().int().min(0).max(100_000_000).optional(),
  city: z.string().trim().max(80).optional(),
  industryIds: z.array(z.string().cuid()).max(6).default([]),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
