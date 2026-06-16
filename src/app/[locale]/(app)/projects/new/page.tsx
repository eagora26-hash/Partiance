import { setRequestLocale, getTranslations } from 'next-intl/server';
import { requireUser } from '@/lib/auth/session';
import { getOnboardingReferenceData } from '@/services/onboarding/onboarding.service';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProjectForm } from '@/components/projects/ProjectForm';

export default async function NewProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireUser();
  const t = await getTranslations('projects.form');
  const { industries } = await getOnboardingReferenceData();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-h3 font-bold text-ink">{t('newTitle')}</h1>
      <GlassCard className="p-6 sm:p-8" spotlight={false} interactive={false}>
        <ProjectForm industries={industries} />
      </GlassCard>
    </div>
  );
}
