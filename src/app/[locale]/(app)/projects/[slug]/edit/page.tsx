import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { getProjectForEdit } from '@/services/projects/projects.service';
import { getOnboardingReferenceData } from '@/services/onboarding/onboarding.service';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProjectForm } from '@/components/projects/ProjectForm';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const user = await requireUser();
  const t = await getTranslations('projects.form');

  // Resolve slug → id, then load owner-scoped editable project.
  const ref = await db.project.findUnique({ where: { slug }, select: { id: true } });
  if (!ref) notFound();
  const project = await getProjectForEdit(user.id, ref.id);
  if (!project) notFound();

  const { industries } = await getOnboardingReferenceData();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-h3 font-bold text-ink">{t('editTitle')}</h1>
      <GlassCard className="p-6 sm:p-8" spotlight={false} interactive={false}>
        <ProjectForm
          industries={industries}
          initial={{
            id: project.id,
            title: project.title,
            description: project.description,
            stage: project.stage,
            lookingFor: project.lookingFor,
            budgetCents: project.budgetCents,
            city: project.city,
            industryIds: project.industries.map((i) => i.industryId),
          }}
        />
      </GlassCard>
    </div>
  );
}
