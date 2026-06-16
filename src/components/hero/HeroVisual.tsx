'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Bookmark, Check, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PersonCard } from './PersonCard';
import { CompatibilityRing } from './CompatibilityRing';

/**
 * The hero's animated AI-match ecosystem.
 * Two floating people cards connect (animated line) to a central AI-match panel
 * whose compatibility ring is broken down into *explained* reasons —
 * the product's core promise (MATCHING_ENGINE: "explain every match").
 * A live project card anchors the bottom.
 */
export function HeroVisual() {
  const t = useTranslations('hero');
  const reasons = ['industry', 'skills', 'goals', 'availability', 'values'] as const;

  return (
    <div className="relative mx-auto w-full max-w-[36rem] perspective">
      {/* Connection lines behind everything */}
      <svg
        aria-hidden
        viewBox="0 0 560 520"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M150 120 C 260 150, 300 200, 360 230"
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        />
        <motion.path
          d="M150 360 C 250 330, 300 300, 360 270"
          fill="none"
          stroke="url(#line-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        />
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="560" y2="0">
            <stop stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#67E8F9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#9D8CFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="relative"
      >
        {/* Top-left person */}
        <PersonCard
          className="absolute -left-2 top-0 z-20 sm:-left-6"
          name={t('people.marco.name')}
          role={t('people.marco.role')}
          location={t('people.marco.location')}
          tags={['Dev', 'AI', 'SaaS']}
          matchLabel={t('matchCard.match')}
          matchValue={95}
          floatDelay={0}
        />

        {/* Bottom-left person */}
        <PersonCard
          className="absolute -left-2 top-[16.5rem] z-20 sm:left-2"
          name={t('people.giulia.name')}
          role={t('people.giulia.role')}
          location={t('people.giulia.location')}
          tags={['Marketing', 'Growth']}
          matchLabel={t('matchCard.match')}
          matchValue={92}
          floatDelay={1.5}
        />

        {/* Central AI match panel */}
        <motion.div
          className="relative z-10 ml-auto w-[20.5rem] sm:w-[21.5rem]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GlassCard className="p-5" interactive={false}>
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-body-sm font-semibold text-ink">{t('matchCard.you')}</span>
            </div>

            <div className="flex items-center gap-4">
              <CompatibilityRing value={93} label={t('matchCard.compatibility')} />
              <ul className="flex-1 space-y-1.5">
                {reasons.map((r, i) => (
                  <motion.li
                    key={r}
                    className="flex items-center gap-2 text-[0.72rem] text-muted"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.12 }}
                  >
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {t(`matchCard.reasons.${r}`)}
                  </motion.li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </motion.div>

        {/* Live project card */}
        <motion.div
          className="relative z-10 ml-auto mt-4 w-[20.5rem] sm:w-[22.5rem]"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <GlassCard className="p-5" interactive={false}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-body-sm font-semibold text-ink">{t('project.title')}</h3>
              <Bookmark className="h-4 w-4 shrink-0 text-faint" />
            </div>
            <p className="mt-1.5 text-[0.72rem] leading-relaxed text-muted">{t('project.desc')}</p>
            <div className="mt-3 space-y-1 text-[0.72rem]">
              <p className="text-faint">
                {t('project.looking')}: <span className="font-semibold text-primary">{t('project.role')}</span>
              </p>
              <p className="text-faint">
                {t('project.budget')}:{' '}
                <span className="tnum font-semibold text-ink">{t('project.budgetValue')}</span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Idea', 'Wellness', 'Milano'].map((tag) => (
                <span key={tag} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[0.65rem] text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
