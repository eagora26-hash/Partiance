// =============================================================================
//  <PartianceWordmark /> — the "Partiance" wordmark.
//  In the 3D hero this is a REAL 3D mesh baked into Partiance.glb. This component
//  is the flat companion used in nav / footer / auth screens where text is right.
//
//  Canonical source lives in /branding/partiance. The app imports the runtime
//  copy at src/components/brand/PartianceWordmark.tsx (kept in sync with this).
// =============================================================================
'use client';

export interface PartianceWordmarkProps {
  className?: string;
  /** Render with the brand cyan→iris gradient instead of solid ink. */
  gradient?: boolean;
}

/** The Partiance wordmark — Space Grotesk, tight tracking. */
export function PartianceWordmark({ className, gradient = false }: PartianceWordmarkProps) {
  return (
    <span
      className={[
        'font-display text-[1.18rem] font-bold tracking-tight',
        gradient
          ? 'bg-brand-gradient bg-clip-text text-transparent'
          : 'text-ink',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      Partiance
    </span>
  );
}

export default PartianceWordmark;
