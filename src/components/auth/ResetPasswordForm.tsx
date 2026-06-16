'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { resetPasswordAction, type ActionState } from '@/app/actions/auth.actions';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from './SubmitButton';

const initial: ActionState = { ok: false };

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations('auth.reset');
  const te = useTranslations('auth.errors');
  const tl = useTranslations('auth.login');
  const [state, action] = useActionState(resetPasswordAction, initial);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <p className="text-body-sm text-muted">{t('success')}</p>
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          {tl('submit')}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <Input
        label={t('password')}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password ? te(state.fieldErrors.password as never) : undefined}
      />
      {state.error && state.error !== 'validation_error' && (
        <p className="rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
          {te(state.error as never)}
        </p>
      )}
      <SubmitButton idle={t('submit')} pending={t('submitting')} className="mt-2" />
    </form>
  );
}
