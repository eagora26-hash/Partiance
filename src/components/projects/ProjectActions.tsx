'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';
import { deleteProjectAction } from '@/app/actions/project.actions';

/** Owner-only edit/delete controls shown under each of "my" project cards. */
export function ProjectActions({ projectId, slug }: { projectId: string; slug: string }) {
  const t = useTranslations('projects.mine');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    if (!window.confirm(t('confirmDelete'))) return;
    startTransition(async () => {
      await deleteProjectAction(projectId);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/projects/${slug}/edit`}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-button border border-white/10 bg-white/[0.03] py-2 text-caption font-medium text-muted transition-colors hover:text-ink"
      >
        <Pencil className="h-3.5 w-3.5" />
        {t('edit')}
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="inline-flex items-center justify-center gap-1.5 rounded-button border border-danger/20 bg-danger/5 px-3 py-2 text-caption font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {t('delete')}
      </button>
    </div>
  );
}
