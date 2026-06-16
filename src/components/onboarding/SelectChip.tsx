'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Toggleable pill for multi-select steps (skills, goals, industries). */
export function SelectChip({
  label,
  selected,
  onToggle,
  disabled,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-body-sm font-medium transition-all duration-300 ease-premium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        selected
          ? 'border-primary/50 bg-primary/15 text-ink shadow-glow-soft'
          : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-ink',
        disabled && !selected && 'cursor-not-allowed opacity-40'
      )}
    >
      {selected && <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />}
      {label}
    </button>
  );
}
