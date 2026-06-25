import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  'aria-labelledby'?: string;
  /** decorative side the accent glow pools toward */
  glow?: 'left' | 'right' | 'center' | 'none';
  /** a faint elevated band so the section reads as distinct from its neighbours */
  band?: boolean;
};

/**
 * Section shell giving each block a distinct-yet-cohesive atmosphere:
 *  - an optional positioned accent glow (left/right/center)
 *  - an optional elevated "band" with hairline top/bottom edges
 *  - consistent vertical rhythm
 * Sections fade into one another instead of cutting hard (the band edges are
 * gradient hairlines, the glows bleed past the section bounds).
 */
export function Section({
  children,
  id,
  className,
  glow = 'none',
  band = false,
  ...aria
}: SectionProps) {
  const glowPos: Record<string, string> = {
    left: 'left-[-10%] top-1/4 bg-primary/12',
    right: 'right-[-10%] top-1/3 bg-iris/12',
    center: 'left-1/2 top-1/4 -translate-x-1/2 bg-accent/10',
    none: 'hidden',
  };

  return (
    <section
      id={id}
      {...aria}
      // overflow-x: clip contains the decorative side-glows horizontally (so
      // they can't extend the page's scroll width and cause horizontal scroll
      // on wide/tablet viewports) while still letting them bleed vertically
      // into neighbouring sections — the intended "sections fade into one
      // another" effect. Does NOT create a scroll container.
      className={cn('relative scroll-mt-24 py-section [overflow-x:clip]', id && 'scroll-mt-28', className)}
    >
      {/* positioned accent glow that bleeds past the section bounds */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute h-[34rem] w-[34rem] rounded-full blur-[150px]',
          glowPos[glow]
        )}
      />

      {/* elevated band */}
      {band && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 inset-y-6 -z-[1] bg-gradient-to-b from-white/[0.018] to-transparent"
          />
          <div aria-hidden className="hairline absolute inset-x-0 top-0" />
          <div aria-hidden className="hairline absolute inset-x-0 bottom-0" />
        </>
      )}

      <div className="relative">{children}</div>
    </section>
  );
}
