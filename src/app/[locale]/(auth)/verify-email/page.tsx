import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckCircle2, XCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { verifyEmail } from '@/services/auth/auth.service';

/**
 * Email verification is performed server-side on load (calls the service directly —
 * this IS the server boundary, so a service call is the correct layering).
 */
export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('auth.verify');

  const result = token ? await verifyEmail(token) : { ok: false as const, error: 'invalid' };

  return (
    <GlassCard className="p-7 text-center sm:p-8" spotlight={false} interactive={false}>
      {result.ok ? (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 text-h4 font-bold text-ink">{t('success')}</h1>
          <div className="mt-6 flex justify-center">
            <Button href="/dashboard" size="lg">
              {t('goDashboard')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-12 w-12 text-danger" />
          <h1 className="mt-4 text-h4 font-bold text-ink">{t('invalid')}</h1>
        </>
      )}
    </GlassCard>
  );
}
