import { setRequestLocale, getTranslations } from 'next-intl/server';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Projects } from '@/components/sections/Projects';
import { AIFeatures } from '@/components/sections/AIFeatures';
import { Pricing } from '@/components/sections/Pricing';
import { FAQ } from '@/components/sections/FAQ';
import { CallToAction } from '@/components/sections/CallToAction';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'faq' });

  // SEO: Organization + FAQ structured data (localized).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Partiance',
        url: 'https://partiance.it',
        slogan: 'Build Better Together',
        description:
          locale === 'it'
            ? "L'ecosistema AI per costruire business in Italia."
            : 'The AI ecosystem to build businesses in Italy.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: (['what', 'how', 'free', 'italy', 'data'] as const).map((k) => ({
          '@type': 'Question',
          name: t(`items.${k}.q`),
          acceptedAnswer: { '@type': 'Answer', text: t(`items.${k}.a`) },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AmbientBackground />
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <HowItWorks />
        <Projects />
        <AIFeatures />
        <Pricing />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
