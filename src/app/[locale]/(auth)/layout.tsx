import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Logo } from '@/components/brand/Logo';
import { Link } from '@/i18n/routing';

/** Centered, branded shell for all authentication screens. */
export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AmbientBackground />
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
        <Link href="/" className="mb-8 rounded-full focus-visible:outline-accent" aria-label="Partiance">
          <Logo size={32} />
        </Link>
        <main className="w-full max-w-md">{children}</main>
      </div>
    </>
  );
}
