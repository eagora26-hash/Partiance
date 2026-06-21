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
      <div className="group/field relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-button opacity-0 transition-opacity duration-300 group-focus-within/field:opacity-100"
          style={{ boxShadow: '0 0 0 1px rgb(var(--c-primary)/0.5), 0 8px 30px -8px rgb(var(--c-primary)/0.4)' }}
        />
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={cn(
            'relative w-full resize-y rounded-button border bg-white/[0.025] px-4 py-3 text-body-sm text-ink',
            'placeholder:text-faint transition-[background,border-color] duration-300',
            'focus:border-primary/50 focus:bg-white/[0.04] focus:outline-none',
            error ? 'border-danger/60' : 'border-white/10',
            className
          )}
          {...rest}
        />
      </div>
      {error && (
        <p className="text-micro text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
