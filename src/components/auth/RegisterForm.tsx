'use client';

import { useActionState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { registerAction, type ActionState } from '@/app/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from './SubmitButton';

const initial: ActionState = { ok: false };

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const te = useTranslations('auth.errors');
  const locale = useLocale();
  const router = useRouter();
  const [state, action] = useActionState(registerAction, initial);

  useEffect(() => {
    if (state.ok) router.push('/dashboard');
  }, [state.ok, router]);

  const fieldError = (k: string) =>
    state.fieldErrors?.[k] ? te(state.fieldErrors[k] as never) : undefined;

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />

      <Input label={t('name')} name="name" placeholder={t('namePlaceholder')} autoComplete="name" required error={fieldError('name')} />
      <Input label={t('email')} name="email" type="email" placeholder={t('emailPlaceholder')} autoComplete="email" required error={fieldError('email')} />
      <Input label={t('password')} name="password" type="password" placeholder={t('passwordPlaceholder')} autoComplete="new-password" required error={fieldError('password')} />

      {state.error && state.error !== 'validation_error' && (
        <p className="rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
          {te(state.error as never)}
        </p>
      )}

      <SubmitButton idle={t('submit')} pending={t('submitting')} className="mt-2" />
    </form>
  );
}
