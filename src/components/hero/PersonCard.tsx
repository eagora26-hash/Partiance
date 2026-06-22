'use client';

import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/TiltCard';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export function PersonCard({
  name,
  role,
  location,
  tags,
  matchLabel,
  matchValue,
  className,
  floatDelay = 0,
}: {
  name: string;
  role: string;
  location: string;
  tags: string[];
  matchLabel: string;
  matchValue: number;
  className?: string;
  floatDelay?: number;
}) {
  return (
    <motion.div
      className={cn('w-full', className)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
    >
      <TiltCard intensity={6} className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={name} size={44} />
            <div className="min-w-0">
              <p className="truncate text-body-sm font-semibold leading-tight text-ink">{name}</p>
              <p className="truncate text-micro text-muted">{role}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[0.65rem] font-semibold text-success">
            {matchLabel} {matchValue}%
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[0.65rem] text-muted">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[0.7rem] text-faint">{location}</p>
      </TiltCard>
    </motion.div>
  );
}
