'use client';

import { useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { requestResetAction, type ActionState } from '@/app/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from './SubmitButton';

const initial: ActionState = { ok: false };

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgot');
  const te = useTranslations('auth.errors');
  const locale = useLocale();
  const [state, action] = useActionState(requestResetAction, initial);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <p className="text-body-sm text-muted">{t('sent')}</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <Input label={t('email')} name="email" type="email" autoComplete="email" required />
      {state.error && (
        <p className="rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
          {te(state.error as never)}
        </p>
      )}
      <SubmitButton idle={t('submit')} pending={t('submitting')} className="mt-2" />
    </form>
  );
}
