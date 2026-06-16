import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { getMyProjects } from '@/services/projects/projects.service';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { ProjectActions } from '@/components/projects/ProjectActions';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects.mine' });
  return { title: t('title') };
}

export default async function MyProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser();
  const t = await getTranslations('projects.mine');

  const projects = await getMyProjects(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-h3 font-bold text-ink">{t('title')}</h1>
          <p className="mt-1 text-body-sm text-muted">{t('subtitle')}</p>
        </div>
        <Button href="/projects/new" size="md" iconLeft={<Plus className="h-4 w-4" />}>
          {t('create')}
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="glass flex flex-col items-center gap-4 rounded-card px-6 py-16 text-center shadow-glass">
          <p className="text-body-sm text-muted">{t('empty')}</p>
          <Button href="/projects/new" size="md">
            {t('create')}
          </Button>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-col gap-2">
              <ProjectCard project={p} />
              <ProjectActions projectId={p.id} slug={p.slug} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
