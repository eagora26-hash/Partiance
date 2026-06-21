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
 * The signature surface: glass material + a cursor-following spotlight
 * (a hairline of light that traces the pointer over the border).
 * Spotlight is GPU-cheap (one radial-gradient bound to motion values).
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
        'group relative overflow-hidden rounded-card glass shadow-glass',
        'transition-[transform,box-shadow] duration-500 ease-premium',
        interactive && !reduce && 'hover:-translate-y-1 hover:shadow-lift',
        className
      )}
      style={{ willChange: interactive ? 'transform' : undefined }}
    >
      {spotlight && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}
      {/* top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative">{children}</div>
    </Comp>
  );
}
