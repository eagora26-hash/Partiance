'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { LocaleSwitch } from './LocaleSwitch';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const NAV_KEYS = ['how', 'features', 'projects', 'pricing', 'faq'] as const;
const ANCHORS: Record<(typeof NAV_KEYS)[number], string> = {
  how: '#how',
  features: '#features',
  projects: '#projects',
  pricing: '#pricing',
  faq: '#faq',
};

export function Navbar() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'flex w-full max-w-content items-center justify-between rounded-full px-3 py-2 pl-4 transition-all duration-500 ease-premium',
            scrolled ? 'glass shadow-glass' : 'border border-transparent bg-transparent'
          )}
        >
          <a href="#top" className="rounded-full focus-visible:outline-accent" aria-label="Partnerly">
            <Logo />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <a
                  href={ANCHORS[key]}
                  className="rounded-full px-3.5 py-2 text-caption font-medium text-muted transition-colors duration-300 hover:text-ink"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LocaleSwitch className="hidden sm:inline-flex" />
            <Link
              href="/login"
              className="hidden rounded-full px-3.5 py-2 text-caption font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              {tc('login')}
            </Link>
            <Button href="/register" size="md" className="hidden sm:inline-flex">
              {tc('getStarted')}
            </Button>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t('close') : t('menu')}
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full glass text-ink lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-base/80 backdrop-blur-xl lg:hidden"
          >
            <nav className="mt-24 flex flex-1 flex-col gap-1 px-6">
              {NAV_KEYS.map((key, i) => (
                <motion.a
                  key={key}
                  href={ANCHORS[key]}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/5 py-4 text-h4 font-semibold text-ink"
                >
                  {t(key)}
                </motion.a>
              ))}

              <div className="mt-8 flex flex-col gap-3">
                <Button href="/register" size="lg" className="w-full" magnetic={false}>
                  {tc('getStarted')}
                </Button>
                <Button href="/login" variant="secondary" size="lg" className="w-full">
                  {tc('login')}
                </Button>
                <div className="mt-2 flex justify-center">
                  <LocaleSwitch />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
