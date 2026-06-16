'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { BusinessDna } from '@/services/onboarding/businessDna';

/** The onboarding payoff: animated reveal of the user's Business DNA. */
export function DnaReveal({ dna, matchCount }: { dna: BusinessDna; matchCount: number }) {
  const t = useTranslations('onboarding.result');
  const td = useTranslations();

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/12"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" />
        <Sparkles className="h-9 w-9 text-primary" />
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-caption uppercase tracking-wide text-faint">
        {t('founderTypeLabel')}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-1 text-h2 font-bold text-gradient"
      >
        {td(dna.founderType as never)}
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mx-auto mt-3 max-w-md text-body-sm text-muted">
        {td(dna.summaryKey as never)}
      </motion.p>

      {dna.traits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-6">
          <p className="mb-2.5 text-caption text-faint">{t('traitsLabel')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {dna.traits.map((traitKey) => (
              <Badge key={traitKey} tone="primary">
                {td(traitKey as never)}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 text-body-sm font-medium text-ink">
        {matchCount > 0 ? t('matchesReady', { count: matchCount }) : t('noMatches')}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6">
        <Button href="/dashboard" size="lg">
          {t('cta')}
        </Button>
      </motion.div>
    </div>
  );
}
