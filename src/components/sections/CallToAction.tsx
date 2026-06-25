import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function CallToAction() {
  const t = useTranslations('cta');

  return (
    <section aria-labelledby="cta-title" className="relative py-section [overflow-x:clip]">
      <div className="container">
        <Reveal>
          <div className="conic-border relative rounded-card">
            <div className="glass-deep relative overflow-hidden rounded-card px-6 py-16 text-center shadow-glow sm:px-12 sm:py-24">
              {/* mesh wash + breathing glow inside the band */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-hero opacity-70" />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-72 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-primary/25 blur-[120px] animate-breathe"
              />
              {/* faint floating nodes */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-[12%] top-1/3 h-2 w-2 rounded-full bg-accent/80 shadow-[0_0_14px_rgba(46,242,222,0.9)] animate-float-slow"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute right-[14%] top-1/2 h-1.5 w-1.5 rounded-full bg-iris/80 shadow-[0_0_12px_rgba(91,216,255,0.9)] animate-float"
                style={{ animationDelay: '-2s' }}
              />

              <div className="relative mx-auto max-w-2xl">
                <h2 id="cta-title" className="text-balance text-h2 font-bold text-ink">
                  {t('title')}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-body text-muted">{t('subtitle')}</p>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Button href="/register" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                    {t('button')}
                  </Button>
                  <p className="text-caption text-faint">{t('note')}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
