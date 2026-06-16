'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * PARTNERLY MARK
 * Concept: two nodes linked by a connector = partnership.
 * The two nodes lean toward each other forming an abstract "P" negative space;
 * a brand-gradient stroke ties them together. On hover the link pulses —
 * the connection "completing", echoing the AI-match metaphor.
 */
export function LogoMark({
  className,
  size = 28,
  animated = true,
}: {
  className?: string;
  size?: number;
  animated?: boolean;
}) {
  const reduce = useReducedMotion();
  const enable = animated && !reduce;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Partnerly"
      className={cn('overflow-visible', className)}
      initial="rest"
      whileHover={enable ? 'hover' : undefined}
    >
      <defs>
        <linearGradient id="ptl-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CCCFD" />
          <stop offset="0.5" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#9D8CFF" />
        </linearGradient>
        <filter id="ptl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connector link between the two nodes */}
      <motion.path
        d="M11 11 L21 21"
        stroke="url(#ptl-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        filter="url(#ptl-glow)"
        variants={{
          rest: { pathLength: 1, opacity: 0.9 },
          hover: { pathLength: [0, 1], opacity: 1 },
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Upper node — solid */}
      <motion.circle
        cx="9"
        cy="9"
        r="5"
        fill="url(#ptl-grad)"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '9px 9px' }}
      />

      {/* Lower node — ring (complementary partner) */}
      <motion.circle
        cx="23"
        cy="23"
        r="4.4"
        fill="none"
        stroke="url(#ptl-grad)"
        strokeWidth="2.6"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.12 } }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '23px 23px' }}
      />
    </motion.svg>
  );
}

/** Full lockup: mark + wordmark. */
export function Logo({
  className,
  showWordmark = true,
  size = 28,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="font-display text-[1.18rem] font-bold tracking-tight text-ink">
          Partnerly
        </span>
      )}
    </span>
  );
}
