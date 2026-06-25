'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Compact IT / EN pill that swaps locale while preserving the current path. */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error pathname/params are compatible at runtime
        { pathname, params },
        { locale: next }
      );
    });
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full glass p-0.5 text-micro font-semibold',
        pending && 'opacity-60',
        className
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => change(l)}
          aria-pressed={l === locale}
          className={cn(
            // Roomier tap target on touch (≈40px tall) while staying a compact pill.
            'inline-flex min-h-[36px] items-center rounded-full px-3 py-1.5 uppercase tracking-wide transition-colors duration-300',
            l === locale ? 'bg-white/10 text-ink' : 'text-faint hover:text-muted active:text-ink'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
