import { useTranslations } from 'next-intl';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitch } from './LocaleSwitch';
import { Link } from '@/i18n/routing';

const COLUMNS = {
  product: ['how', 'features', 'pricing', 'projects'],
  company: ['about', 'blog', 'careers', 'contact'],
  legal: ['privacy', 'terms', 'cookies'],
} as const;

/**
 * Every footer link resolves to a real destination — homepage anchors for the
 * product column, real localized pages for company/legal. No placeholder "#".
 * Anchor links use the homepage path so they work from any page (e.g. /privacy).
 */
const LINK_HREFS: Record<string, string> = {
  how: '/#how',
  features: '/#features',
  pricing: '/#pricing',
  projects: '/#projects',
  about: '/about',
  blog: '/blog',
  careers: '/careers',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
};

export function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* top gradient edge + ambient pool */}
      <div aria-hidden className="hairline absolute inset-x-0 top-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
      />

      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              aria-label="Partiance — home"
              className="group/logo relative inline-flex rounded-full focus-visible:outline-accent"
            >
              <span className="absolute -inset-3 -z-10 rounded-full bg-primary/0 blur-md transition-colors duration-500 group-hover/logo:bg-primary/15" />
              <Logo />
            </Link>
            <p className="mt-4 text-body-sm leading-relaxed text-muted">{t('tagline')}</p>
            <div className="mt-6">
              <LocaleSwitch />
            </div>
          </div>

          {/* Link columns */}
          {(Object.keys(COLUMNS) as (keyof typeof COLUMNS)[]).map((col) => (
            <nav key={col} aria-label={t(col)}>
              <h2 className="text-caption font-semibold uppercase tracking-wide text-faint">
                {t(col)}
              </h2>
              {/* Tighter list gap but each link gets vertical padding → a
                  comfortable ≈36px tap height on touch without a sparse look. */}
              <ul className="mt-3 space-y-1">
                {COLUMNS[col].map((link) => (
                  <li key={link}>
                    <Link
                      href={LINK_HREFS[link] ?? '/'}
                      className="group/link relative inline-flex items-center py-1.5 text-body-sm text-muted transition-colors duration-300 hover:text-ink active:text-ink"
                    >
                      {t(`links.${link}`)}
                      <span
                        aria-hidden
                        className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 ease-premium group-hover/link:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-caption text-faint">
            © {year} {tc('brand')}. {t('rights')}
          </p>
          <p className="text-caption text-faint">{t('madeIn')}</p>
        </div>
      </div>
    </footer>
  );
}
