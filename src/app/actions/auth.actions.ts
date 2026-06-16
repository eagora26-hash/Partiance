'use server';

import { headers } from 'next/headers';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn } from '@/lib/auth';
import {
  registerSchema,
  loginSchema,
  requestResetSchema,
  resetPasswordSchema,
} from '@/lib/validations/auth';
import {
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from '@/services/auth/auth.service';
import { rateLimit } from '@/lib/rate-limit';
import { track } from '@/services/analytics';
import { logger } from '@/lib/logger';

/**
 * Auth server actions = the validated API boundary between UI and services.
 * UI components call these; they never import services or the DB directly.
 * Every action: validates input (Zod) → rate-limits → calls service → typed result.
 * Error message strings are i18n keys resolved on the client.
 */
export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local';
}

function zodToFieldErrors(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>) {
  const f: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? 'form');
    if (!f[k]) f[k] = i.message;
  }
  return f;
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ip = await clientKey();
  if (!rateLimit(`register:${ip}`, 5, 60_000).success) {
    return { ok: false, error: 'rate_limited' };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    locale: formData.get('locale') || 'it',
  });
  if (!parsed.success) {
    return { ok: false, error: 'validation_error', fieldErrors: zodToFieldErrors(parsed.error.issues) };
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) return { ok: false, error: result.error };

  // Auto-login after successful registration.
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    logger.warn('auth.register.autologin_failed', { error: (err as Error).message });
  }

  return { ok: true };
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ip = await clientKey();
  if (!rateLimit(`login:${ip}`, 10, 60_000).success) {
    return { ok: false, error: 'rate_limited' };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'validation_error', fieldErrors: zodToFieldErrors(parsed.error.issues) };
  }

  try {
    await signIn('credentials', { ...parsed.data, redirect: false });
    await track('user_logged_in', { metadata: { email: parsed.data.email } });
    return { ok: true };
  } catch (err) {
    if (isRedirectError(err)) throw err;
    // NextAuth throws CredentialsSignin on bad creds.
    return { ok: false, error: 'invalid_credentials' };
  }
}

export async function requestResetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ip = await clientKey();
  if (!rateLimit(`reset-req:${ip}`, 5, 60_000).success) {
    return { ok: false, error: 'rate_limited' };
  }
  const parsed = requestResetSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { ok: false, error: 'validation_error' };

  const locale = (formData.get('locale') as 'it' | 'en') || 'it';
  await requestPasswordReset(parsed.data.email, locale);
  return { ok: true }; // always ok (no account enumeration)
}

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'validation_error', fieldErrors: zodToFieldErrors(parsed.error.issues) };
  }
  const result = await resetPassword(parsed.data.token, parsed.data.password);
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function verifyEmailAction(token: string): Promise<ActionState> {
  const result = await verifyEmail(token);
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}
