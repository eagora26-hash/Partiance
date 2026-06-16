'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { loginAction, type ActionState } from '@/app/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from './SubmitButton';

const initial: ActionState = { ok: false };

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const t = useTranslations('auth.login');
  const te = useTranslations('auth.errors');
  const router = useRouter();
  const [state, action] = useActionState(loginAction, initial);

  useEffect(() => {
    if (state.ok) {
      // Full reload so the new session cookie is picked up by the server.
      window.location.href = callbackUrl || '/dashboard';
    }
  }, [state.ok, callbackUrl]);

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Input label={t('email')} name="email" type="email" autoComplete="email" required />
      <div className="flex flex-col gap-1.5">
        <Input label={t('password')} name="password" type="password" autoComplete="current-password" required />
        <Link href="/forgot-password" className="self-end text-micro text-primary transition-colors hover:text-primary-hover">
          {t('forgot')}
        </Link>
      </div>

      {state.error && (
        <p className="rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
          {te(state.error as never)}
        </p>
      )}

      <SubmitButton idle={t('submit')} pending={t('submitting')} className="mt-2" />
    </form>
  );
}
