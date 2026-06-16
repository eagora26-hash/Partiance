'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, LineChart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroVisual } from '@/components/hero/HeroVisual';

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 },
  }),
};

export function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');

  const valueProps = [
    { icon: Users, key: 'soci', tone: 'text-primary bg-primary/12' },
    { icon: LineChart, key: 'investitori', tone: 'text-iris bg-iris/12' },
    { icon: Briefcase, key: 'collaboratori', tone: 'text-accent bg-accent/12' },
  ] as const;

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Left column */}
          <div className="flex flex-col items-start">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <Badge tone="primary" dot>
                {t('badge')}
              </Badge>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 text-balance text-hero font-bold leading-[1.02] text-ink"
            >
              {t('titleLine1')}
              <br className="hidden sm:block" /> {t('titleLine2')}{' '}
              <span className="text-gradient">{t('titleEmphasis')}</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-body-lg text-muted"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button href="/register" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t('ctaPrimary')}
              </Button>
              <Button href="#projects" variant="secondary" size="lg">
                {t('ctaSecondary')}
              </Button>
            </motion.div>

            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-4 text-caption text-faint"
            >
              {tc('freeForever')} · {tc('noCard')}
            </motion.p>

            {/* Value props */}
            <motion.ul
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 grid w-full gap-5 sm:grid-cols-3"
            >
              {valueProps.map(({ icon: Icon, key, tone }) => (
                <li key={key} className="flex flex-col gap-2">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-body-sm font-semibold text-ink">{t(`props.${key}.title`)}</p>
                  <p className="text-caption leading-snug text-muted">{t(`props.${key}.desc`)}</p>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right column — animated ecosystem.
              Clipped on small screens so the floating, absolutely-positioned
              cards can never introduce horizontal scroll (mobile-first rule). */}
          <div className="relative -mx-5 overflow-x-clip px-5 sm:mx-0 sm:px-0 lg:pl-4">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
