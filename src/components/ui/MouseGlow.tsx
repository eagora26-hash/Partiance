'use client';

import { useEffect } from 'react';

/**
 * Tracks the pointer and publishes its position to CSS custom properties
 * (--mx / --my) on <body>, throttled to one update per animation frame.
 * The AmbientBackground reads these to float a soft teal glow that follows
 * the cursor — a site-wide "alive" feel without per-component listeners.
 * No-op for touch / reduced-motion users.
 */
export function MouseGlow() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;

    let raf = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight * 0.28;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.body.style.setProperty('--mx', `${px}px`);
        document.body.style.setProperty('--my', `${py}px`);
        raf = 0;
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
