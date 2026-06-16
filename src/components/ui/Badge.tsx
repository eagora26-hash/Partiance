import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: 'glass' | 'primary' | 'success' | 'muted';
  /** small leading dot */
  dot?: boolean;
};

const tones = {
  glass: 'glass text-muted',
  primary: 'border border-primary/30 bg-primary/10 text-primary',
  success: 'border border-success/30 bg-success/10 text-success',
  muted: 'border border-white/10 bg-white/[0.03] text-faint',
};

const dotTones = {
  glass: 'bg-accent',
  primary: 'bg-primary',
  success: 'bg-success',
  muted: 'bg-faint',
};

export function Badge({ children, className, tone = 'glass', dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-micro font-medium tracking-tight',
        tones[tone],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring', dotTones[tone])} />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotTones[tone])} />
        </span>
      )}
      {children}
    </span>
  );
}
