'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, LineChart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroVisual } from '@/components/hero/HeroVisual';

// The 3D hero is REAL WebGL (React Three Fiber) — it can't be server-rendered.
// Load it client-only; while it boots, the brand SVG holds the same identity so
// there's no layout shift and the centerpiece is always present.
const PartianceHero = dynamic(
  () => import('@/components/hero/PartianceHero').then((m) => m.PartianceHero),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Partiance-fallback.svg" alt="Partiance" className="w-[280px] max-w-[70%]" />
      </div>
    ),
  }
);

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
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      {/* === CENTERPIECE: the REAL 3D Partiance hero logo === */}
      <div className="relative flex flex-col items-center text-center">
        {/* Cyan accent glow pooled behind the 3D object */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        />

        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="h-[44vh] min-h-[320px] w-full max-w-3xl sm:h-[52vh] lg:h-[58vh]"
        >
          <PartianceHero height="100%" />
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="-mt-4">
          <Badge tone="primary" dot>
            {t('badge')}
          </Badge>
        </motion.div>

        <motion.h1
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-4xl text-balance text-hero font-bold leading-[1.02] text-ink"
        >
          {t('titleLine1')} {t('titleLine2')}{' '}
          <span className="text-gradient">{t('titleEmphasis')}</span>
        </motion.h1>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-balance text-body-lg text-muted"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          custom={4}
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
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 text-caption text-faint"
        >
          {tc('freeForever')} · {tc('noCard')}
        </motion.p>
      </div>

      {/* === Supporting: the animated AI-match ecosystem + value props === */}
      <div className="container mt-20 lg:mt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
          {/* Value props */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full gap-5 sm:grid-cols-3 lg:grid-cols-1"
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

          {/* Animated ecosystem.
              Clipped on small screens so the floating, absolutely-positioned
              cards can never introduce horizontal scroll (mobile-first rule). */}
          <div className="relative -mx-5 overflow-x-clip px-5 sm:mx-0 sm:px-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
