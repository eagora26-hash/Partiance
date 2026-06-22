import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Locale routing — Italian-first (LOCALIZATION_SYSTEM.md).
 * Default locale `it` is NOT prefixed in the URL (cleaner for the primary market),
 * `/en` is explicit for the secondary audience.
 */
export const routing = defineRouting({
  locales: ['it', 'en'],
  defaultLocale: 'it',
  localePrefix: 'as-needed',
  // Italy-first: the root always serves Italian. We do NOT auto-redirect based
  // on the browser's Accept-Language — English is an explicit opt-in via `/en`.
  // This keeps the default region consistent for the primary (Italian) market.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
