'use client';

import { useActionState, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SelectChip } from '@/components/onboarding/SelectChip';
import { createProjectAction, updateProjectAction, type ProjectFormState } from '@/app/actions/project.actions';

type Ref = { id: string; slug: string; nameIt: string; nameEn: string };

export type ProjectInitial = {
  id: string;
  title: string;
  description: string;
  stage: string;
  lookingFor: string[];
  budgetCents: number | null;
  city: string | null;
  industryIds: string[];
};

const STAGES = ['IDEA', 'MVP', 'STARTUP', 'SCALING'] as const;
const LOOKING = ['COFOUNDER', 'INVESTOR', 'COLLABORATOR', 'MENTOR'] as const;
const initialState: ProjectFormState = { ok: false };

export function ProjectForm({ industries, initial }: { industries: Ref[]; initial?: ProjectInitial }) {
  const t = useTranslations('projects.form');
  const tp = useTranslations('projects');
  const te = useTranslations('projects.errors');
  const locale = useLocale();
  const router = useRouter();
  const isEdit = Boolean(initial);

  const boundAction = isEdit
    ? updateProjectAction.bind(null, initial!.id)
    : createProjectAction;
  const [state, action, pending] = useActionState(boundAction, initialState);

  const [stage, setStage] = useState(initial?.stage ?? 'IDEA');
  const [lookingFor, setLookingFor] = useState<string[]>(initial?.lookingFor ?? []);
  const [industryIds, setIndustryIds] = useState<string[]>(initial?.industryIds ?? []);

  const label = (r: Ref) => (locale === 'en' ? r.nameEn : r.nameIt);
  const toggle = (arr: string[], set: (v: string[]) => void, id: string) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  useEffect(() => {
    if (state.ok) router.push('/projects');
  }, [state.ok, router]);

  const fe = (k: string) => (state.fieldErrors?.[k] ? te(state.fieldErrors[k] as never) : undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* hidden multi-values */}
      <input type="hidden" name="stage" value={stage} />
      {lookingFor.map((l) => (
        <input key={l} type="hidden" name="lookingFor" value={l} />
      ))}
      {industryIds.map((i) => (
        <input key={i} type="hidden" name="industryIds" value={i} />
      ))}

      <Input label={t('title')} name="title" defaultValue={initial?.title} placeholder={t('titlePlaceholder')} required error={fe('title')} />
      <Textarea label={t('description')} name="description" defaultValue={initial?.description} placeholder={t('descriptionPlaceholder')} rows={6} required error={fe('description')} />

      <div>
        <p className="mb-2 text-caption font-medium text-muted">{t('stage')}</p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <SelectChip key={s} label={tp(`stage.${s}`)} selected={stage === s} onToggle={() => setStage(s)} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-caption font-medium text-muted">{t('lookingFor')}</p>
        <div className="flex flex-wrap gap-2">
          {LOOKING.map((l) => (
            <SelectChip key={l} label={tp(`lookingForOptions.${l}`)} selected={lookingFor.includes(l)} onToggle={() => toggle(lookingFor, setLookingFor, l)} />
          ))}
        </div>
        {fe('lookingFor') && <p className="mt-1.5 text-micro text-danger">{fe('lookingFor')}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={t('budget')} name="budgetEuros" type="number" min={0} defaultValue={initial?.budgetCents != null ? initial.budgetCents / 100 : undefined} />
        <Input label={t('city')} name="city" defaultValue={initial?.city ?? undefined} placeholder="Milano" />
      </div>

      <div>
        <p className="mb-2 text-caption font-medium text-muted">{t('industries')}</p>
        <div className="flex flex-wrap gap-2">
          {industries.map((i) => (
            <SelectChip key={i.id} label={label(i)} selected={industryIds.includes(i.id)} onToggle={() => toggle(industryIds, setIndustryIds, i.id)} />
          ))}
        </div>
      </div>

      {state.error && state.error !== 'validation_error' && (
        <p className="rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
          {te(state.error as never)}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-brand-gradient text-body-sm font-semibold text-base shadow-glow transition-opacity disabled:opacity-70 sm:w-auto sm:self-start sm:px-8"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isEdit ? (pending ? t('saving') : t('save')) : pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
