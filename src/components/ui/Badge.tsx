import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: 'glass' | 'primary' | 'success' | 'muted';
  /** small leading dot with a live pulse-ring */
  dot?: boolean;
};

const tones = {
  glass: 'glass text-muted ring-grad',
  primary: 'border border-primary/30 bg-primary/10 text-primary-hover',
  success: 'border border-success/30 bg-success/10 text-success',
  muted: 'border border-white/10 bg-white/[0.03] text-faint',
};

const dotTones = {
  glass: 'bg-accent',
  primary: 'bg-primary-hover',
  success: 'bg-success',
  muted: 'bg-faint',
};

export function Badge({ children, className, tone = 'glass', dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        // Slightly looser, more deliberate tracking + a hairline top highlight
        // so the chip reads as a small piece of embossed glass, not flat.
        'relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1 text-micro font-medium tracking-[0.03em]',
        'shadow-[inset_0_1px_0_0_rgb(var(--border)/0.12)]',
        tones[tone],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-pulse-ring',
              dotTones[tone]
            )}
          />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dotTones[tone])}>
            {/* tiny specular dot on the live indicator — a detail you feel, not notice */}
            <span className="absolute left-[1px] top-[1px] h-[3px] w-[3px] rounded-full bg-white/70" />
          </span>
        </span>
      )}
      <span className="relative">{children}</span>
    </span>
  );
}
