'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Briefcase, LineChart, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroVisual } from '@/components/hero/HeroVisual';

// The 3D hero is REAL WebGL (React Three Fiber) — it can't be server-rendered.
// Client-only; the brand SVG holds the same identity while it boots (no CLS).
const PartianceHero = dynamic(
  () => import('@/components/hero/PartianceHero').then((m) => m.PartianceHero),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Partiance-fallback.svg" alt="Partiance" className="w-[260px] max-w-[65%] opacity-90" />
      </div>
    ),
  }
);

const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.09 },
  }),
};

export function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax: the 3D stage drifts up + fades slightly as you scroll past it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);
  const ringsRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  const valueProps = [
    { icon: Users, key: 'soci', tone: 'text-primary bg-primary/12 ring-primary/25' },
    { icon: LineChart, key: 'investitori', tone: 'text-iris bg-iris/12 ring-iris/25' },
    { icon: Briefcase, key: 'collaboratori', tone: 'text-accent bg-accent/12 ring-accent/25' },
  ] as const;

  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      {/* === CENTERPIECE: the REAL 3D Partiance hero logo, on a depth stage === */}
      <div ref={ref} className="relative flex flex-col items-center text-center">
        <motion.div
          style={{ y: stageY, opacity: stageOpacity }}
          className="relative h-[46vh] min-h-[340px] w-full max-w-3xl sm:h-[54vh] lg:h-[60vh]"
        >
          {/* layered glow pool behind the object */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[130px] animate-breathe"
          />
          {/* orbiting decorative rings (parallax-rotated) */}
          <motion.div
            aria-hidden
            style={{ rotate: ringsRotate }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] hidden -translate-x-1/2 -translate-y-1/2 sm:block"
          >
            <div className="h-[30rem] w-[30rem] rounded-full border border-primary/10" />
            <div className="absolute inset-8 rounded-full border border-iris/10" />
            <div className="absolute inset-20 rounded-full border border-accent/10" />
            {/* a couple of nodes riding the ring */}
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_16px_rgba(46,242,222,0.9)]" />
            <span className="absolute bottom-8 right-10 h-1.5 w-1.5 rounded-full bg-iris shadow-[0_0_12px_rgba(91,216,255,0.9)]" />
          </motion.div>

          <PartianceHero height="100%" />
        </motion.div>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="-mt-2">
          <Badge tone="glass" dot>
            {t('badge')}
          </Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-4xl text-balance text-hero font-bold leading-[1.02] text-ink"
        >
          {t('titleLine1')} {t('titleLine2')}{' '}
          <span className="text-gradient">{t('titleEmphasis')}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-balance text-body-lg text-muted"
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
      </div>

      {/* === Supporting: value props + the animated AI-match ecosystem === */}
      <div className="container mt-20 lg:mt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full gap-5 sm:grid-cols-3 lg:grid-cols-1"
          >
            {valueProps.map(({ icon: Icon, key, tone }, i) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group flex gap-4 lg:items-start"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110 ${tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-body-sm font-semibold text-ink">{t(`props.${key}.title`)}</p>
                  <p className="text-caption leading-snug text-muted">{t(`props.${key}.desc`)}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <div className="relative -mx-5 overflow-x-clip px-5 sm:mx-0 sm:px-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
