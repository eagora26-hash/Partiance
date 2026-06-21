import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#050816',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const isIt = locale === 'it';

  const title = isIt
    ? 'Partiance — Trova soci, investitori e collaboratori con l’AI'
    : 'Partiance — Find co-founders, investors & collaborators with AI';
  const description = isIt
    ? 'La piattaforma AI che unisce imprenditori, investitori e professionisti in Italia per trasformare le idee in grandi business.'
    : 'The AI platform connecting entrepreneurs, investors and professionals in Italy to turn ideas into great businesses.';

  return {
    metadataBase: new URL('https://partiance.it'),
    title: { default: title, template: `%s · ${t('brand')}` },
    description,
    applicationName: 'Partiance',
    keywords: isIt
      ? ['trova soci', 'co-founder Italia', 'investitori startup', 'business partner AI', 'matching imprenditori']
      : ['find co-founder', 'Italy startup investors', 'business partner AI', 'entrepreneur matching'],
    alternates: {
      canonical: isIt ? '/' : '/en',
      languages: { it: '/', en: '/en' },
    },
    openGraph: {
      type: 'website',
      locale: isIt ? 'it_IT' : 'en_US',
      siteName: 'Partiance',
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-base font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-base"
        >
          {locale === 'it' ? 'Vai al contenuto' : 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
