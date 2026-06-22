import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { env } from '@/lib/env';
import { hashPassword, verifyPassword } from '@/lib/password';
import { sendEmail } from '@/services/email';
import { track } from '@/services/analytics';
import { logger } from '@/lib/logger';
import { verificationEmail, passwordResetEmail } from '@/services/email/templates';
import type { RegisterInput } from '@/lib/validations/auth';

/**
 * Authentication business logic (service layer). Server actions call THIS;
 * never the DB directly. All flows are real: bcrypt hashing, DB persistence,
 * token issuance, real emails (MailHog in dev), event tracking.
 */

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const RESET_TTL_MS = 1000 * 60 * 60; // 1h

export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function newToken(): string {
  return randomBytes(32).toString('hex');
}

/** Register a credentials account, create FREE subscription + empty profile, send verification. */
export async function registerUser(input: RegisterInput): Promise<ServiceResult<{ userId: string }>> {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    // Do not leak which emails exist beyond a generic conflict.
    return { ok: false, error: 'email_in_use' };
  }

  const passwordHash = await hashPassword(input.password);

  const user = await db.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      locale: input.locale,
      profile: { create: {} },
      subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
    },
  });

  // Issue + send email verification token.
  const token = newToken();
  await db.verificationToken.create({
    data: { userId: user.id, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
  });

  const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
  try {
    await sendEmail(verificationEmail(input.email, input.locale, input.name, verifyUrl));
  } catch (err) {
    // Non-fatal: account exists; user can re-request verification.
    logger.error('auth.register.email_failed', { userId: user.id, error: (err as Error).message });
  }

  await track('user_signed_up', { userId: user.id, metadata: { locale: input.locale } });
  logger.info('auth.register.success', { userId: user.id });

  return { ok: true, data: { userId: user.id } };
}

/** Verify email via token. */
export async function verifyEmail(token: string): Promise<ServiceResult> {
  const record = await db.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { ok: false, error: 'invalid_or_expired_token' };
  }

  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    db.verificationToken.delete({ where: { id: record.id } }),
  ]);

  await track('user_verified_email', { userId: record.userId });
  return { ok: true, data: undefined };
}

/** Begin password reset. Always returns ok (don't reveal account existence). */
export async function requestPasswordReset(email: string, locale: 'it' | 'en'): Promise<ServiceResult> {
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    const token = newToken();
    // Invalidate any earlier unused tokens so only the latest link works.
    await db.$transaction([
      db.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
      db.passwordResetToken.create({
        data: { userId: user.id, token, expires: new Date(Date.now() + RESET_TTL_MS) },
      }),
    ]);
    const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;
    try {
      await sendEmail(passwordResetEmail(user.email, locale, user.name ?? '', resetUrl));
    } catch (err) {
      logger.error('auth.reset.email_failed', { userId: user.id, error: (err as Error).message });
    }
  }
  return { ok: true, data: undefined };
}

/** Complete password reset with a valid token. */
export async function resetPassword(token: string, newPassword: string): Promise<ServiceResult> {
  const record = await db.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expires < new Date()) {
    return { ok: false, error: 'invalid_or_expired_token' };
  }

  const passwordHash = await hashPassword(newPassword);
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  logger.info('auth.reset.success', { userId: record.userId });
  return { ok: true, data: undefined };
}

/** Used by tests/health checks to confirm a credential is valid. */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user?.passwordHash) return false;
  return verifyPassword(password, user.passwordHash);
}
