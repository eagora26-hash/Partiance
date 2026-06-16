'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated circular compatibility gauge.
 * Stroke draws in on view; center value counts up via CSS-free Framer.
 */
export function CompatibilityRing({ value = 93, label }: { value?: number; label: string }) {
  const reduce = useReducedMotion();
  const r = 46;
  const c = 2 * Math.PI * r;
  const target = c * (1 - value / 100);

  return (
    <div className="relative grid h-[116px] w-[116px] shrink-0 place-items-center">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? target : c }}
          whileInView={{ strokeDashoffset: target }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="110" y2="110">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#9D8CFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="tnum text-[1.75rem] font-bold leading-none text-ink">{value}%</span>
        <span className="mt-1 text-[0.6rem] uppercase tracking-wide text-faint">{label}</span>
      </div>
    </div>
  );
}
