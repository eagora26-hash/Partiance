'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { SelectChip } from '@/components/onboarding/SelectChip';

const STAGES = ['IDEA', 'MVP', 'STARTUP', 'SCALING'] as const;
const LOOKING = ['COFOUNDER', 'INVESTOR', 'COLLABORATOR', 'MENTOR'] as const;

export function ExploreFilters({
  activeStage,
  activeLookingFor,
}: {
  activeStage?: string;
  activeLookingFor?: string;
}) {
  const t = useTranslations('explore.filters');
  const tp = useTranslations('projects');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!value || params.get(key) === value) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-caption text-faint">{t('stage')}:</span>
        {STAGES.map((s) => (
          <SelectChip key={s} label={tp(`stage.${s}`)} selected={activeStage === s} onToggle={() => setParam('stage', s)} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-caption text-faint">{t('lookingFor')}:</span>
        {LOOKING.map((l) => (
          <SelectChip key={l} label={tp(`lookingForOptions.${l}`)} selected={activeLookingFor === l} onToggle={() => setParam('lookingFor', l)} />
        ))}
      </div>
    </div>
  );
}
