'use client';

import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { logoutAction } from '@/app/actions/session.actions';

export function DashboardTopbar({ name, email }: { name: string; email: string }) {
  const t = useTranslations('dashboard');

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5">
        <Logo />
        <div className="flex items-center gap-3">
          <LocaleSwitch className="hidden sm:inline-flex" />
          <div className="flex items-center gap-2.5">
            <Avatar name={name || email} size={36} />
            <span className="hidden text-caption text-muted sm:block">{name || email}</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="grid h-10 w-10 place-items-center rounded-full glass text-muted transition-colors hover:text-ink"
              aria-label={t('logout')}
              title={t('logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
