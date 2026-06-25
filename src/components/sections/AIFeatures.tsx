import { useTranslations } from 'next-intl';
import { BrainCircuit, FileSpreadsheet, ShieldCheck, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TiltCard } from '@/components/ui/TiltCard';
import { Section } from '@/components/ui/Section';

const FEATURES = [
  { key: 'match', icon: Sparkles, tone: 'text-primary bg-primary/12 ring-primary/25', span: 'lg:col-span-2' },
  { key: 'validator', icon: BrainCircuit, tone: 'text-iris bg-iris/12 ring-iris/25', span: '' },
  { key: 'plan', icon: FileSpreadsheet, tone: 'text-accent bg-accent/12 ring-accent/25', span: '' },
  { key: 'investor', icon: ShieldCheck, tone: 'text-success bg-success/12 ring-success/25', span: 'lg:col-span-2' },
] as const;

export function AIFeatures() {
  const t = useTranslations('ai');

  return (
    <Section id="features" aria-labelledby="ai-title" glow="right" band>
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, tone, span }, i) => (
            <li key={key} className={span}>
              <Reveal delay={i * 0.09} className="h-full">
                <TiltCard intensity={5} className="flex h-full flex-col p-7">
                  {/* Icon tile: lifts + brightens its ring and casts a soft tinted
                      glow on hover — the icon reads as a small lit object. */}
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_-8px_currentColor] ${tone}`}
                  >
                    <Icon className="h-6 w-6 transition-transform duration-500 ease-premium group-hover:scale-110" />
                  </span>
                  <h3 className="mt-5 text-h5 font-semibold tracking-[-0.01em] text-ink">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-md text-body-sm leading-relaxed text-muted">
                    {t(`features.${key}.desc`)}
                  </p>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
