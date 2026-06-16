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
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
