'use client';

import { type ReactNode, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';

/* helper: map a 0..1 spring to a +/- degree rotation */
function useTransformDeg(v: MotionValue<number>, max: number, invert: boolean) {
  return useTransform(v, [0, 1], invert ? [max, -max] : [-max, max]);
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  intensity?: number;
  /** cursor-following spotlight */
  spotlight?: boolean;
  /** glass material + lift on hover */
  surface?: boolean;
  as?: 'div' | 'article' | 'li';
};

/**
 * The signature interactive surface. Tilts toward the cursor in 3D, floats a
 * teal spotlight that tracks the pointer, lifts on hover and reveals a soft
 * gradient ring. GPU-cheap (transforms + one radial gradient bound to springs).
 * Falls back to a static surface for reduced-motion users.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  spotlight = true,
  surface = true,
  as = 'div',
}: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const Comp = motion[as];

  // pointer position within the card (0..1), spring-smoothed
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 180, damping: 18, mass: 0.4 });

  const rotateX = useTransformDeg(sy, intensity, true);
  const rotateY = useTransformDeg(sx, intensity, false);

  // spotlight position in px (raw, no spring — feels snappier for light)
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(46,242,222,0.14), transparent 60%)`;

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    mx.set(-200);
    my.set(-200);
  };

  if (reduce) {
    return (
      <Comp
        ref={ref as never}
        className={cn(
          'relative overflow-hidden rounded-card',
          surface && 'glass shadow-glass',
          className
        )}
      >
        <div className="relative">{children}</div>
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref as never}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        'group relative overflow-hidden rounded-card [transform-style:preserve-3d]',
        'transition-shadow duration-500 ease-premium',
        surface && 'glass shadow-glass hover:shadow-glow-lg',
        className
      )}
    >
      {/* gradient ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover:opacity-100 ring-grad"
      />
      {/* cursor spotlight */}
      {spotlight && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}
      {/* top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="relative [transform:translateZ(40px)]">{children}</div>
    </Comp>
  );
}
