'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

/** Accessible, on-brand text field with label, error state and password reveal. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, type = 'text', className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && show ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-caption font-medium text-muted">
        {label}
      </label>
      <div className="group/field relative">
        {/* focus glow ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-button opacity-0 transition-opacity duration-300 group-focus-within/field:opacity-100"
          style={{ boxShadow: '0 0 0 1px rgb(var(--c-primary)/0.5), 0 8px 30px -8px rgb(var(--c-primary)/0.4)' }}
        />
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'relative h-12 w-full rounded-button border bg-white/[0.025] px-4 text-body-sm text-ink',
            'placeholder:text-faint transition-[background,border-color] duration-300',
            'focus:border-primary/50 focus:bg-white/[0.04] focus:outline-none',
            error ? 'border-danger/60' : 'border-white/10',
            isPassword && 'pr-12',
            className
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-faint transition-colors hover:text-muted"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-micro text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
