'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
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
      className={cn('w-[15.5rem]', className)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
    >
      <GlassCard className="p-4" interactive={false}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar name={name} size={44} />
            <div>
              <p className="text-body-sm font-semibold leading-tight text-ink">{name}</p>
              <p className="text-micro text-muted">{role}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[0.65rem] font-semibold text-success">
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
      </GlassCard>
    </motion.div>
  );
}
