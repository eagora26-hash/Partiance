import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function CallToAction() {
  const t = useTranslations('cta');

  return (
    <section aria-labelledby="cta-title" className="relative py-section">
      <div className="container">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-card px-6 py-16 text-center shadow-glass sm:px-12 sm:py-20">
            {/* ambient glow inside the band */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
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
        </Reveal>
      </div>
    </section>
  );
}
