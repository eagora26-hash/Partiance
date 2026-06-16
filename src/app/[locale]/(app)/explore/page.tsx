import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth/session';
import { exploreProjects } from '@/services/projects/projects.service';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ExploreFilters } from '@/components/projects/ExploreFilters';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'explore' });
  return { title: t('title') };
}

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ stage?: string; lookingFor?: string }>;
}) {
  const { locale } = await params;
  const { stage, lookingFor } = await searchParams;
  setRequestLocale(locale);
  const session = await getSession();
  const t = await getTranslations('explore');

  const projects = await exploreProjects({ viewerId: session?.user?.id, stage, lookingFor });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h3 font-bold text-ink">{t('title')}</h1>
        <p className="mt-1 text-body-sm text-muted">{t('subtitle')}</p>
      </div>

      <ExploreFilters activeStage={stage} activeLookingFor={lookingFor} />

      {projects.length === 0 ? (
        <div className="glass rounded-card px-6 py-16 text-center text-body-sm text-muted shadow-glass">{t('empty')}</div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} showBookmark />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
