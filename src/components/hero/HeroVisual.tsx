'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Bookmark, Check, Sparkles } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { PersonCard } from './PersonCard';
import { CompatibilityRing } from './CompatibilityRing';

/**
 * The hero's animated AI-match ecosystem.
 *
 * Layout: a real responsive flow (NOT absolute positioning). Cards live in
 * document order inside a flex column, so the container always grows to contain
 * every card — nothing can clip or overlap. The "floating composition" feel
 * comes from per-card horizontal insets and a small vertical float, both kept
 * well inside the padded wrapper so hover/tilt never pushes a card out of
 * bounds. Every card is `w-full` within a capped column → fully responsive.
 */
export function HeroVisual() {
  const t = useTranslations('hero');
  const reasons = ['industry', 'skills', 'goals', 'availability', 'values'] as const;

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      {/* Ambient connective field — diffuse glow + drifting nodes, behind cards.
          Clipped to this box so the blur can't bleed past the section. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[26%] top-[30%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[12%] top-[52%] h-44 w-44 rounded-full bg-iris/[0.08] blur-3xl" />
        <motion.span
          className="absolute left-[40%] top-[28%] h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(46,242,222,0.9)]"
          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute left-[46%] top-[62%] h-1 w-1 rounded-full bg-iris shadow-[0_0_10px_rgba(91,216,255,0.9)]"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
      </div>

      {/* py gives the float/tilt room so motion stays inside the wrapper. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className="flex flex-col gap-5 py-2"
      >
        {/* Row 1: person card, nudged left, narrower than full width */}
        <PersonCard
          className="w-full max-w-[17rem] self-start sm:ml-2"
          name={t('people.marco.name')}
          role={t('people.marco.role')}
          location={t('people.marco.location')}
          tags={['Dev', 'AI', 'SaaS']}
          matchLabel={t('matchCard.match')}
          matchValue={95}
          floatDelay={0}
        />

        {/* Row 2: the central AI match panel — full width, the anchor */}
        <motion.div
          className="w-full self-end sm:max-w-[22rem]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TiltCard intensity={6} className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-hover">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-body-sm font-semibold text-ink">{t('matchCard.you')}</span>
            </div>

            <div className="flex items-center gap-4">
              <CompatibilityRing value={93} label={t('matchCard.compatibility')} />
              <ul className="min-w-0 flex-1 space-y-1.5">
                {reasons.map((r, i) => (
                  <motion.li
                    key={r}
                    className="flex items-center gap-2 text-[0.72rem] text-muted"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.12 }}
                  >
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="truncate">{t(`matchCard.reasons.${r}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </motion.div>

        {/* Row 3: second person card, nudged left, overlapping rows visually
            via the column gap only — never absolute */}
        <PersonCard
          className="w-full max-w-[17rem] self-start sm:ml-6"
          name={t('people.giulia.name')}
          role={t('people.giulia.role')}
          location={t('people.giulia.location')}
          tags={['Marketing', 'Growth']}
          matchLabel={t('matchCard.match')}
          matchValue={92}
          floatDelay={1.5}
        />

        {/* Row 4: live project card — full width, the bottom anchor */}
        <motion.div
          className="w-full self-end sm:max-w-[23rem]"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <TiltCard intensity={6} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-body-sm font-semibold text-ink">{t('project.title')}</h3>
              <Bookmark className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-primary-hover" />
            </div>
            <p className="mt-1.5 text-[0.72rem] leading-relaxed text-muted">{t('project.desc')}</p>
            <div className="mt-3 space-y-1 text-[0.72rem]">
              <p className="text-faint">
                {t('project.looking')}:{' '}
                <span className="font-semibold text-primary-hover">{t('project.role')}</span>
              </p>
              <p className="text-faint">
                {t('project.budget')}:{' '}
                <span className="tnum font-semibold text-ink">{t('project.budgetValue')}</span>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Idea', 'Wellness', 'Milano'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[0.65rem] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
