import { useTranslations } from 'next-intl';
import { FileText, Sparkles, UserPlus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TiltCard } from '@/components/ui/TiltCard';
import { Section } from '@/components/ui/Section';

const STEPS = [
  { key: 'profile', icon: UserPlus, tone: 'text-primary bg-primary/12 ring-primary/25' },
  { key: 'publish', icon: FileText, tone: 'text-iris bg-iris/12 ring-iris/25' },
  { key: 'match', icon: Sparkles, tone: 'text-accent bg-accent/12 ring-accent/25' },
] as const;

export function HowItWorks() {
  const t = useTranslations('how');

  return (
    <Section id="how" aria-labelledby="how-title" glow="left">
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="relative mt-16">
          {/* Premium step connector (desktop) — a soft, glowing "journey" line
              tucked BEHIND the cards (negative z, blurred, low opacity) with a
              station node per step. Reads as depth, never a hard rule slicing
              across the card tops. A column grid keeps it aligned to the cards. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[3.25rem] -z-10 hidden grid-cols-3 gap-6 lg:grid"
          >
            {/* the connecting beam, spanning the inner two-thirds */}
            <span className="absolute left-[16%] right-[16%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <span className="absolute left-[16%] right-[16%] top-1/2 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-[3px]" />
            {/* one station node per step column */}
            {STEPS.map(({ key }) => (
              <span key={key} className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(46,242,222,0.55)] ring-2 ring-base" />
              </span>
            ))}
          </div>
          <ol className="grid gap-6 lg:grid-cols-3">
            {STEPS.map(({ key, icon: Icon, tone }, i) => (
              <li key={key}>
                <Reveal delay={i * 0.1}>
                  <TiltCard intensity={6} className="h-full p-6">
                    <div className="flex items-center gap-4">
                      <span
                        className={`relative grid h-14 w-14 place-items-center rounded-2xl ring-1 transition-transform duration-500 group-hover:scale-105 ${tone}`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="tnum text-h3 font-bold text-white/[0.08]">{`0${i + 1}`}</span>
                    </div>
                    <h3 className="mt-5 text-h5 font-semibold text-ink">
                      {t(`steps.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-muted">
                      {t(`steps.${key}.desc`)}
                    </p>
                  </TiltCard>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
