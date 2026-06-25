'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// The 3D sculpture is real WebGL — client-only, lazy-loaded so it never blocks
// the initial paint. While it boots (or if WebGL/reduced-motion rules it out),
// the flat SVG watermarks below stand in with the same identity (no layout shift).
const LogoBackdrop = dynamic(
  () => import('@/components/hero/LogoBackdrop').then((m) => m.LogoBackdrop),
  { ssr: false }
);

function webglOK() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Decides between the premium 3D brand sculpture and the flat SVG fallback.
 * Renders the 3D backdrop only when WebGL is available AND motion is allowed;
 * otherwise the static SVG watermarks (passed as children) remain the identity.
 *
 * The whole thing is decorative: heavily dimmed + radially masked here so it
 * reads as luxury background depth, never competing with the page content.
 */
export function BrandBackdrop({ children }: { children: React.ReactNode }) {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Skip the 3D layer on coarse pointers / small screens (phones) — keep the
    // lightweight SVG there for battery + perf; the sculpture shines on desktop.
    const wide = window.matchMedia('(min-width: 768px)').matches;
    setUse3D(!reduce && wide && webglOK());
  }, []);

  if (!use3D) return <>{children}</>;

  return (
    // Dimmed + radially feathered so the sculpture dissolves into the page —
    // visible enough to read its form, quiet enough to stay behind the content.
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.24] [mask-image:radial-gradient(120%_100%_at_50%_45%,#000_50%,transparent_88%)] [-webkit-mask-image:radial-gradient(120%_100%_at_50%_45%,#000_50%,transparent_88%)]"
    >
      <LogoBackdrop className="h-full w-full" />
    </div>
  );
}
