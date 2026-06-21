import { useTranslations } from 'next-intl';
import { ArrowRight, Bookmark, GraduationCap, HeartPulse, Leaf, Plane } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TiltCard } from '@/components/ui/TiltCard';
import { Section } from '@/components/ui/Section';
import { Link } from '@/i18n/routing';

const PROJECTS = [
  { key: 'wellness', icon: HeartPulse, tone: 'text-primary bg-primary/12 ring-primary/25' },
  { key: 'tourism', icon: Plane, tone: 'text-warning bg-warning/12 ring-warning/25' },
  { key: 'food', icon: Leaf, tone: 'text-success bg-success/12 ring-success/25' },
  { key: 'edtech', icon: GraduationCap, tone: 'text-iris bg-iris/12 ring-iris/25' },
] as const;

export function Projects() {
  const t = useTranslations('projects');

  return (
    <Section id="projects" aria-labelledby="projects-title" glow="right">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={t('eyebrow')}
            title={t('title')}
            className="max-w-2xl min-w-0"
          />
          <Reveal from="left">
            <Link
              href="#"
              className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full glass px-4 py-2 text-body-sm font-semibold text-primary-hover transition-colors hover:bg-white/[0.06]"
            >
              {t('viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map(({ key, icon: Icon, tone }, i) => {
            const tags = t(`items.${key}.tags`)
              .split(',')
              .map((s) => s.trim());
            return (
              <li key={key}>
                <Reveal delay={i * 0.08}>
                  <TiltCard as="article" intensity={7} className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between">
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-xl ring-1 transition-transform duration-500 group-hover:scale-110 ${tone}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <button
                        type="button"
                        aria-label="Salva progetto"
                        className="grid h-8 w-8 place-items-center rounded-lg text-faint transition-all duration-300 hover:scale-110 hover:bg-white/5 hover:text-primary-hover"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="mt-4 text-body font-semibold leading-tight text-ink">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="mt-2 flex-1 text-caption leading-relaxed text-muted">
                      {t(`items.${key}.desc`)}
                    </p>

                    <div className="mt-4 space-y-1 text-caption">
                      <p className="text-faint">
                        {t('looking')}:{' '}
                        <span className="font-semibold text-primary-hover">
                          {t(`items.${key}.looking`)}
                        </span>
                      </p>
                      <p className="text-faint">
                        {t('budget')}:{' '}
                        <span className="tnum font-semibold text-ink">
                          {t(`items.${key}.budget`)}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.05] px-2 py-0.5 text-micro text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary-hover"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TiltCard>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
