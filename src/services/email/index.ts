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
    secure: false,
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

const provider: EmailProvider = features.resend ? new ResendProvider() : new SmtpProvider();

export async function sendEmail(msg: EmailMessage): Promise<void> {
  try {
    await provider.send(msg);
    logger.info('email.sent', { to: msg.to, subject: msg.subject, provider: features.resend ? 'resend' : 'smtp' });
  } catch (err) {
    logger.error('email.failed', { to: msg.to, error: (err as Error).message });
    throw err;
  }
}
