import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { getProjectBySlug } from '@/services/projects/projects.service';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title ?? 'Progetto' };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  const t = await getTranslations('projects');

  const project = await getProjectBySlug(slug, session?.user?.id);
  if (!project) notFound();

  const budget =
    project.budgetCents != null
      ? new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(project.budgetCents / 100)
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <GlassCard className="p-7 sm:p-9" spotlight={false} interactive={false}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">{t(`stage.${project.stage}`)}</Badge>
          {project.lookingFor.map((l) => (
            <Badge key={l} tone="glass">
              {t(`lookingForOptions.${l}`)}
            </Badge>
          ))}
        </div>

        <h1 className="mt-5 text-h2 font-bold text-ink">{project.title}</h1>

        <div className="mt-4 flex items-center gap-3">
          <Avatar name={project.owner.name ?? '—'} size={36} />
          <span className="text-body-sm text-muted">{project.owner.name}</span>
          {project.city && (
            <span className="inline-flex items-center gap-1 text-caption text-faint">
              <MapPin className="h-3.5 w-3.5" /> {project.city}
            </span>
          )}
        </div>

        <p className="mt-6 whitespace-pre-wrap text-body leading-relaxed text-muted">{project.description}</p>

        {(budget || project.industries.length > 0) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/5 pt-6">
            {budget && (
              <div>
                <p className="text-caption text-faint">{t('budget')}</p>
                <p className="tnum mt-0.5 text-h5 font-bold text-ink">{budget}</p>
              </div>
            )}
            {project.industries.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.industries.map((i) => (
                  <span key={i.industry.slug} className="rounded-md bg-white/[0.05] px-2.5 py-1 text-caption text-muted">
                    {locale === 'en' ? i.industry.nameEn : i.industry.nameIt}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
