'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Bookmark } from 'lucide-react';
import { useState, useTransition } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Link } from '@/i18n/routing';
import { toggleBookmarkAction } from '@/app/actions/project.actions';
import { cn } from '@/lib/utils';

export type ProjectCardData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  stage: string;
  lookingFor: string[];
  budgetCents: number | null;
  city: string | null;
  owner: { name: string | null };
  industries: { industry: { slug: string; nameIt: string; nameEn: string } }[];
  bookmarked?: boolean;
};

function formatBudget(cents: number | null, locale: string): string | null {
  if (cents == null) return null;
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function ProjectCard({ project, showBookmark = false }: { project: ProjectCardData; showBookmark?: boolean }) {
  const t = useTranslations('projects');
  const te = useTranslations('explore');
  const locale = useLocale();
  const [bookmarked, setBookmarked] = useState(project.bookmarked ?? false);
  const [pending, startTransition] = useTransition();

  const budget = formatBudget(project.budgetCents, locale);
  const industryLabel = (i: ProjectCardData['industries'][number]) =>
    locale === 'en' ? i.industry.nameEn : i.industry.nameIt;

  const onBookmark = () => {
    setBookmarked((b) => !b); // optimistic
    startTransition(async () => {
      const res = await toggleBookmarkAction(project.id);
      if (res.ok && typeof res.bookmarked === 'boolean') setBookmarked(res.bookmarked);
    });
  };

  return (
    <GlassCard as="article" className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Badge tone="muted">{t(`stage.${project.stage}`)}</Badge>
        {showBookmark && (
          <button
            type="button"
            onClick={onBookmark}
            disabled={pending}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? te('bookmarked') : te('bookmark')}
            className={cn(
              'grid h-8 w-8 place-items-center rounded-lg transition-colors',
              bookmarked ? 'text-primary' : 'text-faint hover:text-ink'
            )}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
          </button>
        )}
      </div>

      <Link href={`/projects/${project.slug}`} className="mt-3 block">
        <h3 className="text-body font-semibold leading-tight text-ink transition-colors hover:text-primary">
          {project.title}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 flex-1 text-caption leading-relaxed text-muted">{project.description}</p>

      <div className="mt-4 space-y-1.5 text-caption">
        <p className="text-faint">
          {t('looking')}:{' '}
          <span className="font-medium text-primary">
            {project.lookingFor.map((l) => t(`lookingForOptions.${l}`)).join(', ')}
          </span>
        </p>
        {budget && (
          <p className="text-faint">
            {t('budget')}: <span className="tnum font-semibold text-ink">{budget}</span>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
        {project.industries.slice(0, 3).map((i) => (
          <span key={i.industry.slug} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-micro text-muted">
            {industryLabel(i)}
          </span>
        ))}
        {project.city && <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-micro text-muted">{project.city}</span>}
      </div>
    </GlassCard>
  );
}
