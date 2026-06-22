import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContentPage, type ContentSection } from './ContentPage';

type CtaResolver = (label: string) => { label: string; href: string } | undefined;

/**
 * Factory for the static content pages (about, contact, privacy, …). Each route
 * is a thin wrapper that points here with its `pages.<key>` namespace, so all
 * copy is localized and there is exactly one rendering path to maintain.
 */
export function makeContentPage(key: string, resolveCta?: CtaResolver) {
  return async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations(`pages.${key}`);

    // `sections` is an array in the catalog; next-intl exposes it via t.raw.
    const sections = (t.raw('sections') as ContentSection[]) ?? [];
    const hasMeta = messageExists(t, 'meta');
    const ctaLabel = messageExists(t, 'cta') ? t('cta') : undefined;
    const cta = ctaLabel && resolveCta ? resolveCta(ctaLabel) : undefined;

    return (
      <ContentPage
        eyebrow={t('eyebrow')}
        title={t('title')}
        meta={hasMeta ? t('meta') : undefined}
        intro={messageExists(t, 'intro') ? t('intro') : undefined}
        sections={sections}
        cta={cta}
      />
    );
  };
}

/** next-intl throws on missing keys; probe with t.has when available. */
function messageExists(t: Awaited<ReturnType<typeof getTranslations>>, key: string): boolean {
  const maybeHas = (t as unknown as { has?: (k: string) => boolean }).has;
  if (typeof maybeHas === 'function') return maybeHas(key);
  try {
    t(key as never);
    return true;
  } catch {
    return false;
  }
}
