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

  // Parallax: the watermark logo drifts slowly + fades as you scroll past it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.2]);
  const ringsRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 30]);

  const valueProps = [
    { icon: Users, key: 'soci', tone: 'text-primary bg-primary/12 ring-primary/25' },
    { icon: LineChart, key: 'investitori', tone: 'text-iris bg-iris/12 ring-iris/25' },
    { icon: Briefcase, key: 'collaboratori', tone: 'text-accent bg-accent/12 ring-accent/25' },
  ] as const;

  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      {/* === TEXT-FIRST HERO ===
          The message and primary CTA lead. The 3D Partiance mark is demoted to a
          subtle background watermark behind the copy — present as a secondary
          identity cue (low opacity, soft blur, slow rotation), never competing
          for attention. */}
      <div ref={ref} className="relative flex flex-col items-center text-center">
        {/* --- background brand watermark (decorative, behind the text) --- */}
        <motion.div
          aria-hidden
          style={{ y: markY, opacity: markOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[40rem] w-[40rem] max-w-[120vw] -translate-x-1/2 -translate-y-[58%] select-none"
        >
          {/* soft glow pool that anchors the watermark */}
          <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[130px] animate-breathe" />
          {/* faint orbiting rings, slowly parallax-rotated */}
          <motion.div
            style={{ rotate: ringsRotate }}
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
          >
            <div className="h-[28rem] w-[28rem] rounded-full border border-primary/[0.06]" />
            <div className="absolute inset-8 rounded-full border border-iris/[0.05]" />
            <div className="absolute inset-20 rounded-full border border-accent/[0.05]" />
          </motion.div>
          {/* the real 3D mark, dimmed + blurred + masked into the page */}
          <div className="absolute inset-0 opacity-[0.12] blur-[2px] [mask-image:radial-gradient(60%_60%_at_50%_45%,#000_30%,transparent_78%)] [-webkit-mask-image:radial-gradient(60%_60%_at_50%_45%,#000_30%,transparent_78%)]">
            <PartianceHero height="100%" watermark />
          </div>
        </motion.div>

        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
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
          className="mt-9 flex flex-col gap-3 sm:flex-row"
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

          <div className="relative min-w-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
