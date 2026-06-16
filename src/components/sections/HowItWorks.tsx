import { useTranslations } from 'next-intl';
import { FileText, Sparkles, UserPlus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';

const STEPS = [
  { key: 'profile', icon: UserPlus, tone: 'text-primary bg-primary/12 ring-primary/20' },
  { key: 'publish', icon: FileText, tone: 'text-iris bg-iris/12 ring-iris/20' },
  { key: 'match', icon: Sparkles, tone: 'text-accent bg-accent/12 ring-accent/20' },
] as const;

export function HowItWorks() {
  const t = useTranslations('how');

  return (
    <section id="how" aria-labelledby="how-title" className="relative scroll-mt-24 py-section">
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/12 to-transparent lg:block"
          />
          <ol className="grid gap-6 lg:grid-cols-3">
            {STEPS.map(({ key, icon: Icon, tone }, i) => (
              <li key={key}>
                <Reveal delay={i * 0.1}>
                  <GlassCard className="h-full p-6">
                    <div className="flex items-center gap-4">
                      <span className={`relative grid h-14 w-14 place-items-center rounded-2xl ring-1 ${tone}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="tnum text-h3 font-bold text-white/10">{`0${i + 1}`}</span>
                    </div>
                    <h3 className="mt-5 text-h5 font-semibold text-ink">{t(`steps.${key}.title`)}</h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-muted">{t(`steps.${key}.desc`)}</p>
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
