import { setRequestLocale, getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/ui/GlassCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Link } from '@/i18n/routing';

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.forgot');

  return (
    <GlassCard className="p-7 sm:p-8" spotlight={false} interactive={false}>
      <h1 className="text-h4 font-bold text-ink">{t('title')}</h1>
      <p className="mt-1.5 text-body-sm text-muted">{t('subtitle')}</p>
      <div className="mt-7">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-caption">
        <Link href="/login" className="inline-block rounded-md py-1 font-semibold text-primary transition-colors hover:text-primary-hover active:text-primary-hover">
          {t('back')}
        </Link>
      </p>
    </GlassCard>
  );
}
