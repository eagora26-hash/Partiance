'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Code2,
  Crown,
  Loader2,
  type LucideIcon,
  Palette,
  Sparkles,
  TrendingUp,
  UserCog,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { SelectChip } from './SelectChip';
import { Slider } from './Slider';
import { DnaReveal } from './DnaReveal';
import { submitOnboardingAction, type OnboardingState } from '@/app/actions/onboarding.actions';
import { cn } from '@/lib/utils';

type Ref = { id: string; slug: string; nameIt: string; nameEn: string };
type RefData = { skills: Ref[]; goals: Ref[]; industries: Ref[] };

const PERSONAS: { value: string; icon: LucideIcon }[] = [
  { value: 'FOUNDER', icon: Crown },
  { value: 'INVESTOR', icon: TrendingUp },
  { value: 'DEVELOPER', icon: Code2 },
  { value: 'DESIGNER', icon: Palette },
  { value: 'FREELANCER', icon: Briefcase },
  { value: 'AGENCY', icon: UserCog },
  { value: 'MENTOR', icon: Sparkles },
];

const AVAILABILITY = ['FULL_TIME', 'PART_TIME', 'WEEKENDS', 'OCCASIONAL'] as const;
const TOTAL = 5;
const initial: OnboardingState = { ok: false };

export function OnboardingWizard({ refData }: { refData: RefData }) {
  const t = useTranslations('onboarding');
  const te = useTranslations('onboarding.errors');
  const locale = useLocale();
  const label = (r: Ref) => (locale === 'en' ? r.nameEn : r.nameIt);

  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<string>('');
  const [city, setCity] = useState('');
  const [availability, setAvailability] = useState<string>('FULL_TIME');
  const [headline, setHeadline] = useState('');
  const [skillIds, setSkillIds] = useState<string[]>([]);
  const [goalIds, setGoalIds] = useState<string[]>([]);
  const [industryIds, setIndustryIds] = useState<string[]>([]);
  const [personality, setPersonality] = useState({
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    risk: 50,
  });

  const [state, action, pending] = useActionState(submitOnboardingAction, initial);

  const toggle = (arr: string[], set: (v: string[]) => void, id: string, max: number) => {
    if (arr.includes(id)) set(arr.filter((x) => x !== id));
    else if (arr.length < max) set([...arr, id]);
  };

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(persona) && city.trim().length >= 2;
      case 1:
        return skillIds.length >= 1;
      case 2:
        return goalIds.length >= 1 && industryIds.length >= 1;
      case 3:
        return true;
      default:
        return true;
    }
  }, [step, persona, city, skillIds, goalIds, industryIds]);

  const payload = useMemo(
    () => ({ persona, city: city.trim(), availability, headline: headline.trim() || undefined, skillIds, goalIds, industryIds, personality }),
    [persona, city, availability, headline, skillIds, goalIds, industryIds, personality]
  );

  // When submit succeeds, advance to the DNA reveal (step 4).
  useEffect(() => {
    if (state.ok) setStep(4);
  }, [state.ok]);

  const stepKeys = ['persona', 'skills', 'goals', 'personality', 'analysis'] as const;

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      {step < 4 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-caption text-muted">
            <span>{t('progress', { current: step + 1, total: TOTAL })}</span>
            <span className="tnum">{Math.round(((step + 1) / TOTAL) * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-brand-gradient"
              initial={false}
              animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      <GlassCard className="p-6 sm:p-8" spotlight={false} interactive={false}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step < 4 && (
              <div className="mb-6">
                <h1 className="text-h4 font-bold text-ink">{t(`steps.${stepKeys[step]}.title`)}</h1>
                <p className="mt-1.5 text-body-sm text-muted">{t(`steps.${stepKeys[step]}.subtitle`)}</p>
              </div>
            )}

            {/* STEP 0 — persona + city + availability */}
            {step === 0 && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PERSONAS.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPersona(value)}
                      aria-pressed={persona === value}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-card border p-4 transition-all duration-300 ease-premium',
                        persona === value
                          ? 'border-primary/50 bg-primary/12 shadow-glow-soft'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', persona === value ? 'text-primary' : 'text-muted')} />
                      <span className={cn('text-caption font-medium', persona === value ? 'text-ink' : 'text-muted')}>
                        {t(`persona.${value}`)}
                      </span>
                    </button>
                  ))}
                </div>
                <Input label={t('fields.city')} value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('fields.cityPlaceholder')} />
                <div>
                  <p className="mb-2 text-caption font-medium text-muted">{t('fields.availability')}</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY.map((a) => (
                      <SelectChip key={a} label={t(`availability.${a}`)} selected={availability === a} onToggle={() => setAvailability(a)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 — skills */}
            {step === 1 && (
              <div className="flex flex-wrap gap-2.5">
                {refData.skills.map((s) => (
                  <SelectChip key={s.id} label={label(s)} selected={skillIds.includes(s.id)} onToggle={() => toggle(skillIds, setSkillIds, s.id, 12)} />
                ))}
              </div>
            )}

            {/* STEP 2 — goals + industries */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-2.5">
                  {refData.goals.map((g) => (
                    <SelectChip key={g.id} label={label(g)} selected={goalIds.includes(g.id)} onToggle={() => toggle(goalIds, setGoalIds, g.id, 8)} />
                  ))}
                </div>
                <div>
                  <p className="mb-2.5 text-caption font-medium text-muted">{t('industries')}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {refData.industries.map((i) => (
                      <SelectChip key={i.id} label={label(i)} selected={industryIds.includes(i.id)} onToggle={() => toggle(industryIds, setIndustryIds, i.id, 6)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — personality */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <Input label={t('fields.headline')} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={t('fields.headlinePlaceholder')} />
                {(['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'risk'] as const).map((key) => (
                  <Slider
                    key={key}
                    label={t(`personality.${key}`)}
                    lowLabel={t('personality.low')}
                    highLabel={t('personality.high')}
                    value={personality[key]}
                    onChange={(v) => setPersonality((p) => ({ ...p, [key]: v }))}
                  />
                ))}
              </div>
            )}

            {/* STEP 4 — DNA reveal */}
            {step === 4 && state.dna && <DnaReveal dna={state.dna} matchCount={state.matchCount ?? 0} />}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {state.error && (
          <p className="mt-4 rounded-button border border-danger/30 bg-danger/10 px-4 py-2.5 text-caption text-danger" role="alert">
            {te(state.error as never)}
          </p>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={cn('inline-flex items-center gap-1.5 text-body-sm font-medium text-muted transition-colors hover:text-ink', step === 0 && 'invisible')}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => canProceed && setStep((s) => s + 1)}
                disabled={!canProceed}
                className="inline-flex h-12 items-center gap-2 rounded-button bg-brand-gradient px-6 text-body-sm font-semibold text-base shadow-glow transition-opacity disabled:opacity-40"
              >
                {t('next')}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <form
                action={(fd) => {
                  fd.set('payload', JSON.stringify(payload));
                  action(fd);
                }}
              >
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-12 items-center gap-2 rounded-button bg-brand-gradient px-6 text-body-sm font-semibold text-base shadow-glow transition-opacity disabled:opacity-70"
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {pending ? t('finishing') : t('finish')}
                  {!pending && <Sparkles className="h-4 w-4" />}
                </button>
              </form>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
