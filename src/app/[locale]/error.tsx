'use client';

import { useEffect } from 'react';

/**
 * Branded error boundary for everything under /[locale]. Replaces Next/Vercel's
 * raw "server-side exception" white screen with a calm, on-brand, recoverable
 * panel. Self-contained (no i18n provider dependency — it can render even when
 * context is unavailable) and detects IT/EN from the URL.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the browser/Vercel logs for debugging.
    console.error('app.error_boundary', error);
  }, [error]);

  const isIt =
    typeof window !== 'undefined' ? !window.location.pathname.startsWith('/en') : true;

  const copy = isIt
    ? {
        title: 'Qualcosa è andato storto',
        body: 'Si è verificato un errore imprevisto. Riprova tra un momento — se il problema persiste, scrivici.',
        retry: 'Riprova',
        home: 'Torna alla home',
      }
    : {
        title: 'Something went wrong',
        body: 'An unexpected error occurred. Please try again in a moment — if it keeps happening, get in touch.',
        retry: 'Try again',
        home: 'Back to home',
      };

  return (
    <div className="grid min-h-dvh place-items-center bg-base px-6 text-center">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/15 blur-[120px]"
        />
        <div className="relative rounded-card border border-white/10 bg-white/[0.04] p-8 shadow-glass backdrop-blur-xl">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-danger/15 text-danger ring-1 ring-danger/25">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="mt-5 text-xl font-bold text-ink">{copy.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.body}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-button bg-brand-gradient px-5 text-sm font-semibold text-base shadow-glow transition-transform active:scale-[0.98]"
            >
              {copy.retry}
            </button>
            <a
              href={isIt ? '/' : '/en'}
              className="inline-flex h-11 items-center justify-center rounded-button border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-ink transition-colors hover:bg-white/[0.08]"
            >
              {copy.home}
            </a>
          </div>

          {error.digest && (
            <p className="mt-5 text-[11px] text-faint">ref: {error.digest}</p>
          )}
        </div>
      </div>
    </div>
  );
}
