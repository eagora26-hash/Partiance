import { z } from 'zod';

/** Shared auth validation (runtime_rules: always validate requests). */

export const emailSchema = z.string().trim().toLowerCase().email();

export const passwordSchema = z
  .string()
  .min(8, 'password_too_short')
  .max(72, 'password_too_long') // bcrypt hard limit
  .regex(/[a-z]/, 'password_needs_lowercase')
  .regex(/[A-Z]/, 'password_needs_uppercase')
  .regex(/[0-9]/, 'password_needs_number');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'name_too_short').max(80),
  email: emailSchema,
  password: passwordSchema,
  locale: z.enum(['it', 'en']).default('it'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'password_required'),
});

export const requestResetSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
