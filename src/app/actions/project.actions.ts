'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth/session';
import { projectInputSchema } from '@/lib/validations/project';
import {
  createProject,
  updateProject,
  deleteProject,
  setProjectStatus,
  toggleBookmark,
} from '@/services/projects/projects.service';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export type ProjectFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  slug?: string;
};

function parseForm(formData: FormData) {
  const lookingFor = formData.getAll('lookingFor').map(String).filter(Boolean);
  const industryIds = formData.getAll('industryIds').map(String).filter(Boolean);
  const budgetRaw = String(formData.get('budgetEuros') ?? '').trim();
  return projectInputSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    stage: formData.get('stage'),
    lookingFor,
    industryIds,
    city: formData.get('city') || undefined,
    budgetEuros: budgetRaw === '' ? undefined : budgetRaw,
  });
}

function fieldErrors(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>) {
  const f: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? 'form');
    if (!f[k]) f[k] = i.message;
  }
  return f;
}

export async function createProjectAction(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const user = await requireUser();
  if (!rateLimit(`project-create:${user.id}`, 20, 60_000).success) return { ok: false, error: 'rate_limited' };

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, error: 'validation_error', fieldErrors: fieldErrors(parsed.error.issues) };

  const result = await createProject(user.id, parsed.data);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath('/projects');
  revalidatePath('/dashboard');
  revalidatePath('/explore');
  return { ok: true, slug: result.data.slug };
}

export async function updateProjectAction(projectId: string, _prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const user = await requireUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, error: 'validation_error', fieldErrors: fieldErrors(parsed.error.issues) };

  const result = await updateProject(user.id, projectId, parsed.data);
  if (!result.ok) return { ok: false, error: result.error };

  revalidatePath('/projects');
  revalidatePath('/explore');
  return { ok: true };
}

export async function deleteProjectAction(projectId: string): Promise<ProjectFormState> {
  const user = await requireUser();
  const result = await deleteProject(user.id, projectId);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath('/projects');
  revalidatePath('/dashboard');
  return { ok: true };
}

export async function setProjectStatusAction(
  projectId: string,
  status: 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'DRAFT'
): Promise<ProjectFormState> {
  const user = await requireUser();
  const result = await setProjectStatus(user.id, projectId, status);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath('/projects');
  return { ok: true };
}

export async function toggleBookmarkAction(projectId: string): Promise<{ ok: boolean; bookmarked?: boolean }> {
  try {
    const user = await requireUser();
    const result = await toggleBookmark(user.id, projectId);
    if (!result.ok) return { ok: false };
    revalidatePath('/explore');
    return { ok: true, bookmarked: result.data.bookmarked };
  } catch (err) {
    logger.warn('projects.bookmark_failed', { error: (err as Error).message });
    return { ok: false };
  }
}
