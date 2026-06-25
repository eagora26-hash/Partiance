import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Shell for static marketing / legal / company pages (about, contact, privacy,
 * terms, cookies, blog, careers). Same chrome as the landing page so navigation
 * feels continuous and every footer/nav link lands on a real, branded page.
 */
export default async function MarketingLayout({
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
      <Navbar />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
