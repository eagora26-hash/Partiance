'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

const ITEMS = ['what', 'how', 'free', 'italy', 'data'] as const;

export function FAQ() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<string | null>('what');

  return (
    <Section id="faq" aria-labelledby="faq-title" glow="left">
      <div className="container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />

        <div className="mx-auto mt-14 max-w-3xl">
          <ul className="glass-deep divide-y divide-white/5 overflow-hidden rounded-card shadow-glass ring-grad">
            {ITEMS.map((key, i) => {
              const isOpen = open === key;
              return (
                <li key={key}>
                  <Reveal delay={i * 0.05}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]',
                          isOpen && 'bg-white/[0.015]'
                        )}
                      >
                        <span
                          className={cn(
                            'text-body font-medium transition-colors',
                            isOpen ? 'text-ink' : 'text-muted'
                          )}
                        >
                          {t(`items.${key}.q`)}
                        </span>
                        <span
                          className={cn(
                            'grid h-8 w-8 shrink-0 place-items-center rounded-full glass text-primary-hover transition-all duration-300 ease-premium',
                            isOpen && 'rotate-45 bg-primary/15 shadow-glow-soft'
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 pr-14 text-body-sm leading-relaxed text-muted">
                            {t(`items.${key}.a`)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
