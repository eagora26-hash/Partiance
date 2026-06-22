import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';
import { TiltCard } from '@/components/ui/TiltCard';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

const PLANS = [
  { key: 'free', featured: false },
  { key: 'premium', featured: true },
  { key: 'business', featured: false },
] as const;

export function Pricing() {
  const t = useTranslations('pricing');

  return (
    <Section id="pricing" aria-labelledby="pricing-title" glow="center">
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <ul className="mx-auto mt-16 grid max-w-5xl items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map(({ key, featured }, i) => {
            const features = t(`plans.${key}.features`).split('|');

            const inner = (
              <>
                {featured && (
                  // Centered pill near the top, fully INSIDE the card (the card
                  // clips overflow). The featured card's extra top padding
                  // reserves its space, so it never overlaps the name/tagline at
                  // any breakpoint.
                  <span className="absolute left-1/2 top-3.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-gradient px-3.5 py-1 text-micro font-semibold text-base shadow-glow-soft">
                    {t('mostPopular')}
                  </span>
                )}
                <h3 className="text-body font-semibold text-ink">{t(`plans.${key}.name`)}</h3>
                <p className="mt-1 text-caption text-muted">{t(`plans.${key}.tagline`)}</p>

                <div className="mt-5 flex items-end gap-1">
                  <span
                    className={cn(
                      'tnum text-h2 font-bold leading-none',
                      featured
                        ? 'bg-brand-gradient bg-clip-text text-transparent'
                        : 'text-ink'
                    )}
                  >
                    {t(`plans.${key}.price`)}
                  </span>
                  <span className="mb-1 text-caption text-faint">{t('perMonth')}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-body-sm text-muted">
                      <span
                        className={cn(
                          'mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full',
                          featured ? 'bg-primary/25 text-primary-hover' : 'bg-success/15 text-success'
                        )}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  href="/register"
                  variant={featured ? 'primary' : 'secondary'}
                  size="lg"
                  magnetic={false}
                  className="mt-7 w-full"
                >
                  {t(`plans.${key}.cta`)}
                </Button>
              </>
            );

            return (
              <li key={key} className={cn('flex', featured && 'lg:-my-3')}>
                <Reveal delay={i * 0.08} className="w-full">
                  {featured ? (
                    // Featured plan: an elevated, glowing card with a spinning conic edge.
                    <div className="conic-border relative h-full rounded-card">
                      <GlassCard
                        className="flex h-full flex-col p-7 pt-10 ring-1 ring-primary/40 shadow-glow-lg"
                        spotlight
                        interactive={false}
                      >
                        {inner}
                      </GlassCard>
                    </div>
                  ) : (
                    <TiltCard intensity={5} className="flex h-full flex-col p-7">
                      {inner}
                    </TiltCard>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
