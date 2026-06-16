import { setRequestLocale, getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/ui/GlassCard';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Link } from '@/i18n/routing';

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('auth.reset');

  return (
    <GlassCard className="p-7 sm:p-8" spotlight={false} interactive={false}>
      <h1 className="text-h4 font-bold text-ink">{t('title')}</h1>
      {token ? (
        <div className="mt-7">
          <ResetPasswordForm token={token} />
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-body-sm text-danger">{t('invalid')}</p>
          <Link href="/forgot-password" className="mt-4 inline-block font-semibold text-primary hover:text-primary-hover">
            ←
          </Link>
        </div>
      )}
    </GlassCard>
  );
}
