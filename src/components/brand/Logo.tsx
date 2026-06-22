'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * PARTIANCE MARK (2D — premium metallic build)
 * Concept: two interlocked links = Partner + Alliance.
 * Partner (brushed graphite) sits behind, Alliance (polished teal-cyan metal)
 * passes in front — the flat companion to the 3D hero mark in Partiance.glb.
 *
 * Crafted to feel like a small machined emblem rather than a flat icon:
 *   • metallic gradients with a specular hot-spot on each link
 *   • a glossy top highlight + faint inner shadow for real depth
 *   • crystal-clear edges (no blur on the silhouette; glow is a separate layer)
 *   • a one-shot reflective sweep that travels across the mark on hover
 * Restrained extrusion — premium, not chunky.
 * Canonical source: /branding/partiance/PartianceLogo.tsx
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
  // Unique id suffix so multiple marks on a page (nav + footer) don't share defs.
  const uid = `ptc-${Math.round(size)}`;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Partiance"
      className={cn('overflow-visible', className)}
      initial="rest"
      whileHover={enable ? 'hover' : undefined}
    >
      <defs>
        {/* Partner link — brushed graphite with a cool top-light */}
        <linearGradient id={`${uid}-partner`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#5A646D" />
          <stop offset="0.35" stopColor="#2C333A" />
          <stop offset="1" stopColor="#0C1014" />
        </linearGradient>
        {/* Alliance link — polished teal-cyan metal */}
        <linearGradient id={`${uid}-alliance`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#B9FFF6" />
          <stop offset="0.32" stopColor="#4FF0E6" />
          <stop offset="0.62" stopColor="#22E3D6" />
          <stop offset="1" stopColor="#0FA89F" />
        </linearGradient>
        {/* specular sheen overlay (top-left hot-spot) */}
        <linearGradient id={`${uid}-spec`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* soft outer glow for the cyan link (separate layer → edges stay crisp) */}
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* depth: a tight drop shadow that lifts the mark off the surface */}
        <filter id={`${uid}-depth`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.55" />
        </filter>
        {/* travelling reflection sweep (revealed via the moving rect's mask) */}
        <linearGradient id={`${uid}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <rect x="10" y="12" width="44" height="38" rx="9" />
        </clipPath>
      </defs>

      <g filter={`url(#${uid}-depth)`}>
        {/* ---- Partner link — graphite, behind ---- */}
        <g>
          <rect
            x="12"
            y="16"
            width="26"
            height="30"
            rx="9"
            fill="none"
            stroke={`url(#${uid}-partner)`}
            strokeWidth="7"
          />
          {/* crisp top highlight on the graphite ring */}
          <rect
            x="12"
            y="16"
            width="26"
            height="30"
            rx="9"
            fill="none"
            stroke={`url(#${uid}-spec)`}
            strokeWidth="2.4"
            strokeOpacity="0.5"
          />
        </g>

        {/* Knockout where the Alliance link passes in front */}
        <line x1="33" y1="20" x2="33" y2="36" stroke="#06080C" strokeWidth="11" strokeLinecap="round" />

        {/* ---- Alliance link — cyan metal, in front. Pulses on hover. ---- */}
        <motion.g
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: '39px 28px' }}
        >
          <rect
            x="26"
            y="14"
            width="26"
            height="28"
            rx="9"
            fill="none"
            stroke={`url(#${uid}-alliance)`}
            strokeWidth="7"
            filter={`url(#${uid}-glow)`}
          />
          {/* glossy specular highlight on the cyan ring */}
          <rect
            x="26"
            y="14"
            width="26"
            height="28"
            rx="9"
            fill="none"
            stroke={`url(#${uid}-spec)`}
            strokeWidth="2.6"
          />
        </motion.g>

        {/* ---- one-shot reflective sweep across the whole mark (on hover) ---- */}
        {enable && (
          <g clipPath={`url(#${uid}-clip)`}>
            <motion.rect
              y="6"
              width="16"
              height="52"
              fill={`url(#${uid}-sweep)`}
              style={{ mixBlendMode: 'screen' }}
              variants={{ rest: { x: -22, opacity: 0 }, hover: { x: 58, opacity: 1 } }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        )}
      </g>
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
          Partiance
        </span>
      )}
    </span>
  );
}
