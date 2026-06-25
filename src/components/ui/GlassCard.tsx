'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  /** show the cursor-tracking glow */
  spotlight?: boolean;
  /** lift slightly on hover */
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
};

/**
 * The signature surface: premium glass material + a cursor-following teal
 * spotlight + a gradient hairline ring that lights up on hover. GPU-cheap
 * (one radial-gradient bound to motion values). For display cards that should
 * also tilt in 3D, use <TiltCard> instead — this is the non-tilting variant
 * used for large panels and form containers where tilt would hurt usability.
 */
export function GlassCard({
  children,
  className,
  spotlight = true,
  interactive = true,
  as = 'div',
}: GlassCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const Comp = motion[as];

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(46,242,222,0.14), transparent 60%)`;

  return (
    <Comp
      ref={ref as never}
      onMouseMove={spotlight && !reduce ? onMove : undefined}
      className={cn(
        'group relative overflow-hidden rounded-card glass shadow-glass card-edge card-corner',
        'transition-[transform,box-shadow] duration-500 ease-premium',
        interactive && !reduce && 'hover:-translate-y-1 hover:shadow-glow-lg',
        className
      )}
      style={{ willChange: interactive ? 'transform' : undefined }}
    >
      {/* gradient hairline ring — lights up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover:opacity-100 ring-grad"
      />
      {/* reflective gloss sweep on hover */}
      {!reduce && (
        <span aria-hidden className="card-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-card" />
      )}
      {spotlight && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}
      <div className="relative">{children}</div>
    </Comp>
  );
}
