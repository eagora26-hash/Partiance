import { type ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export type ContentSection = { heading: string; body: string[] };

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Meta line under the title, e.g. "Last updated: …". */
  meta?: string;
  sections?: ContentSection[];
  /** Optional call-to-action block at the bottom. */
  cta?: { label: string; href: string };
  /** Extra content (e.g. a contact form) rendered after the sections. */
  children?: ReactNode;
};

/**
 * Reusable layout for static company/legal content. Keeps every such page
 * visually consistent with the rest of the site (glass, teal accents, calm
 * reveals) and driven entirely by localized strings — so there are no
 * hardcoded, untranslated ghost pages.
 */
export function ContentPage({
  eyebrow,
  title,
  intro,
  meta,
  sections = [],
  cta,
  children,
}: ContentPageProps) {
  return (
    <section className="relative scroll-mt-28 pb-section pt-32 sm:pt-36">
      <div className="container max-w-prose">
        <Reveal>
          {eyebrow && (
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance text-h1 font-bold leading-[1.05] text-ink">{title}</h1>
          {meta && <p className="mt-4 text-caption text-faint">{meta}</p>}
          {intro && <p className="mt-6 text-body-lg text-muted">{intro}</p>}
        </Reveal>

        {sections.length > 0 && (
          <div className="mt-12 flex flex-col gap-10">
            {sections.map((s, i) => (
              <Reveal key={s.heading} delay={Math.min(i * 0.05, 0.2)}>
                <h2 className="text-h4 font-semibold text-ink">{s.heading}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-body-sm leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {children && <div className="mt-12">{children}</div>}

        {cta && (
          <Reveal delay={0.1} className="mt-12">
            <Button href={cta.href} size="lg">
              {cta.label}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
