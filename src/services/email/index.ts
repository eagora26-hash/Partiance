import nodemailer from 'nodemailer';
import { env, features } from '@/lib/env';
import { logger } from '@/lib/logger';

/**
 * Email provider interface (runtime_rules: provider pattern, real service or
 * graceful local fallback — NEVER a fake no-op that silently drops mail).
 *
 *  - RESEND_API_KEY present  → Resend HTTP API (production).
 *  - otherwise               → SMTP to MailHog (docker, dev) so every email is
 *                              actually sent and viewable at http://localhost:8025.
 */
export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

interface EmailProvider {
  send(msg: EmailMessage): Promise<void>;
}

class ResendProvider implements EmailProvider {
  async send(msg: EmailMessage): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend send failed (${res.status}): ${body}`);
    }
  }
}

class SmtpProvider implements EmailProvider {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    // MailHog needs no auth; guard for real SMTP if creds are provided.
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' } : undefined,
  });

  async send(msg: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    });
  }
}

/**
 * A provider that refuses to silently drop mail. Used when running in production
 * with no real email transport configured: instead of pointing SMTP at a
 * non-existent dev MailHog (which made password-reset "succeed" while no mail
 * ever arrived), we fail loud so the misconfiguration is visible and fixable.
 */
class UnconfiguredProvider implements EmailProvider {
  async send(): Promise<void> {
    throw new Error(
      'No email transport configured. Set RESEND_API_KEY (recommended) or real ' +
        'SMTP_HOST/SMTP_USER/SMTP_PASS to enable verification & password-reset emails.'
    );
  }
}

/**
 * Provider selection:
 *  - RESEND_API_KEY present                    → Resend HTTP API (production).
 *  - explicit non-localhost SMTP host or creds → SMTP (any provider).
 *  - localhost SMTP in development             → MailHog (viewable at :8025).
 *  - anything else in production               → UnconfiguredProvider (fail loud).
 */
function selectProvider(): EmailProvider {
  if (features.resend) return new ResendProvider();

  const isProd = env.NODE_ENV === 'production';
  const hasRealSmtp =
    Boolean(env.SMTP_USER) || (env.SMTP_HOST !== 'localhost' && env.SMTP_HOST.length > 0);

  if (hasRealSmtp) return new SmtpProvider();
  if (!isProd) return new SmtpProvider(); // dev → MailHog

  // Production with no transport: do not pretend to send.
  logger.error('email.misconfigured', {
    detail: 'No RESEND_API_KEY or real SMTP credentials in production.',
  });
  return new UnconfiguredProvider();
}

// Resolved lazily on first send so module import (incl. build-time static
// generation) never logs a misconfiguration for a provider that may never run.
let cachedProvider: EmailProvider | null = null;
function getProvider(): EmailProvider {
  if (!cachedProvider) cachedProvider = selectProvider();
  return cachedProvider;
}

function providerName(p: EmailProvider): string {
  if (features.resend) return 'resend';
  if (p instanceof UnconfiguredProvider) return 'none';
  return 'smtp';
}

export async function sendEmail(msg: EmailMessage): Promise<void> {
  const provider = getProvider();
  try {
    await provider.send(msg);
    logger.info('email.sent', { to: msg.to, subject: msg.subject, provider: providerName(provider) });
  } catch (err) {
    logger.error('email.failed', { to: msg.to, error: (err as Error).message });
    throw err;
  }
}
