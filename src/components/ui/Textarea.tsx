'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, rows = 5, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-caption font-medium text-muted">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full resize-y rounded-button border bg-white/[0.03] px-4 py-3 text-body-sm text-ink',
          'placeholder:text-faint transition-colors duration-300',
          'focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none',
          error ? 'border-danger/60' : 'border-white/10',
          className
        )}
        {...rest}
      />
      {error && (
        <p className="text-micro text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
