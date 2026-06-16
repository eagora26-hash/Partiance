'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts up to a numeric target when scrolled into view, preserving any
 * non-numeric prefix/suffix (e.g. "12.000+", "93%"). Locale-aware grouping.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(reduce ? value : '0');

  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const numStr = match?.[2] ?? value;
  const suffix = match?.[3] ?? '';
  const target = Number(numStr.replace(/[.,]/g, ''));
  const usesGrouping = /[.,]/.test(numStr);

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      const formatted = usesGrouping ? current.toLocaleString('it-IT') : String(current);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, value, prefix, suffix, usesGrouping]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
