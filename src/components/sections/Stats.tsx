import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';

const KEYS = ['builders', 'matches', 'accuracy', 'cities'] as const;

export function Stats() {
  const t = useTranslations('stats');

  return (
    <section aria-labelledby="stats-title" className="relative py-section">
      <div className="container">
        <div className="glass relative overflow-hidden rounded-card px-6 py-10 shadow-glass sm:px-10 sm:py-12">
          <h2 id="stats-title" className="sr-only">
            {t('title')}
          </h2>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          <dl className="grid grid-cols-2 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 0.08} className="text-center">
                <dt className="sr-only">{t(`items.${key}.label`)}</dt>
                <dd>
                  <CountUp
                    value={t(`items.${key}.value`)}
                    className="tnum block bg-ink-fade bg-clip-text text-[2.5rem] font-bold leading-none text-transparent sm:text-[3rem]"
                  />
                  <span className="mt-2 block text-caption text-muted">{t(`items.${key}.label`)}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
