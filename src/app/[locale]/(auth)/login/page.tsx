import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.login' });
  return { title: t('title') };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('auth.login');

  return (
    <GlassCard className="p-7 sm:p-8" spotlight={false} interactive={false}>
      <h1 className="text-h4 font-bold text-ink">{t('title')}</h1>
      <p className="mt-1.5 text-body-sm text-muted">{t('subtitle')}</p>
      <div className="mt-7">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
      <p className="mt-6 text-center text-caption text-muted">
        {t('noAccount')}{' '}
        <Link href="/register" className="inline-block rounded-md py-1 font-semibold text-primary transition-colors hover:text-primary-hover active:text-primary-hover">
          {t('register')}
        </Link>
      </p>
    </GlassCard>
  );
}
