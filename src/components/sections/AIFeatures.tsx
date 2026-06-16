import { useTranslations } from 'next-intl';
import { BrainCircuit, FileSpreadsheet, ShieldCheck, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';

const FEATURES = [
  { key: 'match', icon: Sparkles, tone: 'text-primary bg-primary/12', span: 'lg:col-span-2' },
  { key: 'validator', icon: BrainCircuit, tone: 'text-iris bg-iris/12', span: '' },
  { key: 'plan', icon: FileSpreadsheet, tone: 'text-accent bg-accent/12', span: '' },
  { key: 'investor', icon: ShieldCheck, tone: 'text-success bg-success/12', span: 'lg:col-span-2' },
] as const;

export function AIFeatures() {
  const t = useTranslations('ai');

  return (
    <section id="features" aria-labelledby="ai-title" className="relative scroll-mt-24 py-section">
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, tone, span }, i) => (
            <li key={key} className={span}>
              <Reveal delay={i * 0.08} className="h-full">
                <GlassCard className="flex h-full flex-col p-7">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-h5 font-semibold text-ink">{t(`features.${key}.title`)}</h3>
                  <p className="mt-2 max-w-md text-body-sm leading-relaxed text-muted">
                    {t(`features.${key}.desc`)}
                  </p>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
