// =============================================================================
//  <PartianceLogo /> — the Partiance symbol (2D vector form of the 3D hero mark).
//  Two interlocked links: Partner (graphite, back) + Alliance (cyan, front).
//  This is the 2D lockup mark used in nav / footer / favicons. The REAL hero is
//  the animated GLB rendered by <PartianceHero /> — this is its flat companion.
//
//  Canonical source lives in /branding/partiance. The app imports the runtime
//  copy at src/components/brand/PartianceLogo.tsx (kept in sync with this file).
// =============================================================================
'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface PartianceLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * The Partiance symbol — two interlocked links.
 * Partner (graphite) sits behind, Alliance (cyan) passes in front. On hover the
 * cyan link pulses brighter, echoing the "alliance completing" idea.
 */
export function PartianceLogo({ className, size = 28, animated = true }: PartianceLogoProps) {
  const reduce = useReducedMotion();
  const enable = animated && !reduce;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Partiance"
      className={className}
      style={{ overflow: 'visible' }}
      initial="rest"
      whileHover={enable ? 'hover' : undefined}
    >
      <defs>
        <linearGradient id="ptc-partner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A434B" />
          <stop offset="1" stopColor="#11151B" />
        </linearGradient>
        <linearGradient id="ptc-alliance" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4FF0E6" />
          <stop offset="0.5" stopColor="#22E3D6" />
          <stop offset="1" stopColor="#12B5AB" />
        </linearGradient>
        <filter id="ptc-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Partner link — graphite, behind */}
      <rect
        x="12"
        y="16"
        width="26"
        height="30"
        rx="9"
        fill="none"
        stroke="url(#ptc-partner)"
        strokeWidth="7"
      />

      {/* Knockout where the Alliance link passes in front */}
      <line x1="33" y1="20" x2="33" y2="36" stroke="#06080C" strokeWidth="11" strokeLinecap="round" />

      {/* Alliance link — cyan, in front. Pulses on hover. */}
      <motion.rect
        x="26"
        y="14"
        width="26"
        height="28"
        rx="9"
        fill="none"
        stroke="url(#ptc-alliance)"
        strokeWidth="7"
        filter="url(#ptc-glow)"
        variants={{
          rest: { opacity: 0.95, scale: 1 },
          hover: { opacity: 1, scale: 1.06 },
        }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '39px 28px' }}
      />
    </motion.svg>
  );
}

export default PartianceLogo;
