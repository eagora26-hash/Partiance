import { useTranslations } from 'next-intl';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitch } from './LocaleSwitch';
import { Link } from '@/i18n/routing';

const COLUMNS = {
  product: ['how', 'features', 'pricing', 'projects'],
  company: ['about', 'blog', 'careers', 'contact'],
  legal: ['privacy', 'terms', 'cookies'],
} as const;

export function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 border-t border-white/5">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-body-sm leading-relaxed text-muted">{t('tagline')}</p>
            <div className="mt-6">
              <LocaleSwitch />
            </div>
          </div>

          {/* Link columns */}
          {(Object.keys(COLUMNS) as (keyof typeof COLUMNS)[]).map((col) => (
            <nav key={col} aria-label={t(col)}>
              <h2 className="text-caption font-semibold uppercase tracking-wide text-faint">{t(col)}</h2>
              <ul className="mt-4 space-y-3">
                {COLUMNS[col].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-body-sm text-muted transition-colors duration-300 hover:text-ink"
                    >
                      {t(`links.${link}`)}
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
