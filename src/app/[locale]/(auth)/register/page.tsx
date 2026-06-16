import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.register' });
  return { title: t('title') };
}

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth.register');

  return (
    <GlassCard className="p-7 sm:p-8" spotlight={false} interactive={false}>
      <h1 className="text-h4 font-bold text-ink">{t('title')}</h1>
      <p className="mt-1.5 text-body-sm text-muted">{t('subtitle')}</p>
      <div className="mt-7">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-caption text-muted">
        {t('haveAccount')}{' '}
        <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary-hover">
          {t('login')}
        </Link>
      </p>
    </GlassCard>
  );
}
