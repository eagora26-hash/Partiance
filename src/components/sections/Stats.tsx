import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';

const KEYS = ['builders', 'matches', 'accuracy', 'cities'] as const;

export function Stats() {
  const t = useTranslations('stats');

  return (
    <section aria-labelledby="stats-title" className="relative py-section [overflow-x:clip]">
      <div className="container">
        <div className="glass-deep relative overflow-hidden rounded-card px-6 py-10 shadow-glass ring-grad sm:px-10 sm:py-12">
          <h2 id="stats-title" className="sr-only">
            {t('title')}
          </h2>

          {/* atmosphere inside the band */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/15 blur-[90px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-iris/12 blur-[90px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
          />

          <dl className="relative grid grid-cols-2 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 0.08} className="group text-center">
                <dt className="sr-only">{t(`items.${key}.label`)}</dt>
                <dd>
                  <CountUp
                    value={t(`items.${key}.value`)}
                    className="tnum block bg-ink-fade bg-clip-text text-[2.5rem] font-bold leading-none text-transparent transition-[filter] duration-500 group-hover:[filter:drop-shadow(0_0_18px_rgba(46,242,222,0.45))] sm:text-[3rem]"
                  />
                  <span className="mt-2 block text-caption text-muted">
                    {t(`items.${key}.label`)}
                  </span>
                  {/* hairline that grows on hover */}
                  <span
                    aria-hidden
                    className="mx-auto mt-3 block h-px w-8 origin-center scale-x-0 bg-brand-gradient transition-transform duration-500 ease-premium group-hover:scale-x-100"
                  />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
