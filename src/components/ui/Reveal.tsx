'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** stagger offset in seconds */
  delay?: number;
  /** entrance direction */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** distance in px */
  distance?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

const offsets = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-reveal wrapper. Calm blur + translate, once only.
 *
 * Resilience: content is *never* left permanently invisible. We reveal when the
 * element scrolls into view, but also force-reveal shortly after mount as a
 * fallback (covers crawlers, no-scroll viewports, and observer edge cases).
 * Honors prefers-reduced-motion (renders instantly visible).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
  distance,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const base = offsets[from];
  const o = distance != null ? { x: Math.sign(base.x) * distance, y: Math.sign(base.y) * distance } : base;

  if (reduce) {
    return (
      <div ref={ref} className={className} {...(rest as object)}>
        {children}
      </div>
    );
  }

  const show = inView || fallback;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, x: o.x, y: o.y, filter: 'blur(8px)' }}
      animate={show ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
