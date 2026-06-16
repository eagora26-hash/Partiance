import type { EmailMessage } from './index';

/**
 * Branded, bilingual transactional email templates.
 * Inline styles only (email clients ignore <style>/external CSS).
 */
type Locale = 'it' | 'en';

const COPY = {
  verify: {
    it: {
      subject: 'Conferma il tuo indirizzo email · Partnerly',
      heading: 'Benvenuto in Partnerly',
      body: (name: string) =>
        `Ciao ${name || ''}, conferma il tuo indirizzo email per attivare il tuo account e iniziare a trovare i partner giusti.`,
      cta: 'Conferma email',
      ignore: 'Se non hai creato un account, puoi ignorare questa email.',
    },
    en: {
      subject: 'Confirm your email · Partnerly',
      heading: 'Welcome to Partnerly',
      body: (name: string) =>
        `Hi ${name || ''}, confirm your email to activate your account and start finding the right partners.`,
      cta: 'Confirm email',
      ignore: "If you didn't create an account, you can ignore this email.",
    },
  },
  reset: {
    it: {
      subject: 'Reimposta la tua password · Partnerly',
      heading: 'Reimposta la password',
      body: () => 'Abbiamo ricevuto una richiesta per reimpostare la tua password. Il link scade tra un’ora.',
      cta: 'Reimposta password',
      ignore: 'Se non hai richiesto il reset, ignora questa email: la tua password resta invariata.',
    },
    en: {
      subject: 'Reset your password · Partnerly',
      heading: 'Reset your password',
      body: () => 'We received a request to reset your password. This link expires in one hour.',
      cta: 'Reset password',
      ignore: "If you didn't request this, ignore this email — your password stays the same.",
    },
  },
} as const;

function shell(heading: string, body: string, cta: string, url: string, ignore: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#050816;font-family:Inter,Arial,sans-serif;color:#F9FAFB;padding:32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
    <tr><td style="padding-bottom:24px;font-size:20px;font-weight:700">◆ Partnerly</td></tr>
    <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px">
      <h1 style="margin:0 0 12px;font-size:22px;color:#F9FAFB">${heading}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#94A3B8">${body}</p>
      <a href="${url}" style="display:inline-block;background:linear-gradient(120deg,#38BDF8,#67E8F9);color:#050816;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:14px;font-size:15px">${cta}</a>
      <p style="margin:24px 0 0;font-size:12px;color:#64748B">${ignore}</p>
    </td></tr>
    <tr><td style="padding-top:24px;font-size:12px;color:#64748B">Partnerly · Build Better Together</td></tr>
  </table>
</body></html>`;
}

export function verificationEmail(to: string, locale: Locale, name: string, url: string): EmailMessage {
  const c = COPY.verify[locale];
  return {
    to,
    subject: c.subject,
    html: shell(c.heading, c.body(name), c.cta, url, c.ignore),
    text: `${c.heading}\n\n${c.body(name)}\n\n${c.cta}: ${url}`,
  };
}

export function passwordResetEmail(to: string, locale: Locale, name: string, url: string): EmailMessage {
  const c = COPY.reset[locale];
  return {
    to,
    subject: c.subject,
    html: shell(c.heading, c.body(), c.cta, url, c.ignore),
    text: `${c.heading}\n\n${c.body()}\n\n${c.cta}: ${url}`,
  };
}
