'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Full-width submit button that reflects the enclosing form's pending state. */
export function SubmitButton({
  idle,
  pending: pendingLabel,
  className,
}: {
  idle: string;
  pending: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-gradient',
        'text-body-sm font-semibold text-base shadow-glow transition-opacity duration-300',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-70',
        className
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? pendingLabel : idle}
    </button>
  );
}
