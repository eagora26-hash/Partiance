import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { track } from '@/services/analytics';
import type { ProjectInput } from '@/lib/validations/project';
import type { Prisma } from '@prisma/client';

/**
 * Projects service — full CRUD with ownership authorization. UI/actions call
 * these; never the DB directly. Money is handled in integer cents.
 */

export type ServiceResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

/** Ensure slug uniqueness by appending a short suffix on collision. */
async function uniqueSlug(base: string): Promise<string> {
  const root = base || 'progetto';
  let slug = root;
  for (let i = 0; i < 5; i++) {
    const exists = await db.project.findUnique({ where: { slug }, select: { id: true } });
    if (!exists) return slug;
    slug = `${root}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

const cardSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  stage: true,
  status: true,
  lookingFor: true,
  budgetCents: true,
  city: true,
  updatedAt: true,
  owner: { select: { id: true, name: true, profile: { select: { persona: true } } } },
  industries: { select: { industry: { select: { slug: true, nameIt: true, nameEn: true } } } },
} satisfies Prisma.ProjectSelect;

export async function createProject(ownerId: string, input: ProjectInput): Promise<ServiceResult<{ id: string; slug: string }>> {
  const slug = await uniqueSlug(slugify(input.title));
  const project = await db.project.create({
    data: {
      ownerId,
      title: input.title,
      slug,
      description: input.description,
      stage: input.stage,
      status: 'PUBLISHED',
      lookingFor: input.lookingFor,
      budgetCents: input.budgetEuros != null ? input.budgetEuros * 100 : null,
      city: input.city || null,
      industries: { create: input.industryIds.map((industryId) => ({ industryId })) },
    },
    select: { id: true, slug: true },
  });

  await track('project_created', { userId: ownerId, metadata: { projectId: project.id, stage: input.stage } });
  logger.info('projects.created', { ownerId, projectId: project.id });
  return { ok: true, data: project };
}

export async function updateProject(userId: string, projectId: string, input: ProjectInput): Promise<ServiceResult> {
  const existing = await db.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!existing) return { ok: false, error: 'not_found' };
  if (existing.ownerId !== userId) return { ok: false, error: 'forbidden' };

  await db.$transaction([
    db.projectIndustry.deleteMany({ where: { projectId } }),
    db.project.update({
      where: { id: projectId },
      data: {
        title: input.title,
        description: input.description,
        stage: input.stage,
        lookingFor: input.lookingFor,
        budgetCents: input.budgetEuros != null ? input.budgetEuros * 100 : null,
        city: input.city || null,
        industries: { create: input.industryIds.map((industryId) => ({ industryId })) },
      },
    }),
  ]);

  logger.info('projects.updated', { userId, projectId });
  return { ok: true, data: undefined };
}

export async function deleteProject(userId: string, projectId: string): Promise<ServiceResult> {
  const existing = await db.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!existing) return { ok: false, error: 'not_found' };
  if (existing.ownerId !== userId) return { ok: false, error: 'forbidden' };

  await db.project.delete({ where: { id: projectId } });
  logger.info('projects.deleted', { userId, projectId });
  return { ok: true, data: undefined };
}

export async function setProjectStatus(
  userId: string,
  projectId: string,
  status: 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'DRAFT'
): Promise<ServiceResult> {
  const existing = await db.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!existing) return { ok: false, error: 'not_found' };
  if (existing.ownerId !== userId) return { ok: false, error: 'forbidden' };
  await db.project.update({ where: { id: projectId }, data: { status } });
  return { ok: true, data: undefined };
}

export async function getMyProjects(userId: string) {
  return db.project.findMany({ where: { ownerId: userId }, orderBy: { updatedAt: 'desc' }, select: cardSelect });
}

export async function getProjectForEdit(userId: string, projectId: string) {
  const p = await db.project.findUnique({
    where: { id: projectId },
    select: { ...cardSelect, ownerId: true, industries: { select: { industryId: true } } },
  });
  if (!p || p.ownerId !== userId) return null;
  return p;
}

export async function getProjectBySlug(slug: string, viewerId?: string) {
  const project = await db.project.findUnique({
    where: { slug },
    select: {
      ...cardSelect,
      createdAt: true,
      _count: { select: { bookmarks: true } },
    },
  });
  if (!project) return null;
  const bookmarked = viewerId
    ? Boolean(await db.bookmark.findUnique({ where: { userId_projectId: { userId: viewerId, projectId: project.id } }, select: { id: true } }))
    : false;
  return { ...project, bookmarked };
}

/** Explore feed: published projects, newest first, excluding the viewer's own. */
export async function exploreProjects(opts: {
  viewerId?: string;
  stage?: string;
  lookingFor?: string;
  take?: number;
}) {
  const where: Prisma.ProjectWhereInput = {
    status: 'PUBLISHED',
    ...(opts.viewerId ? { ownerId: { not: opts.viewerId } } : {}),
    ...(opts.stage ? { stage: opts.stage as never } : {}),
    ...(opts.lookingFor ? { lookingFor: { has: opts.lookingFor as never } } : {}),
  };
  return db.project.findMany({ where, orderBy: { createdAt: 'desc' }, take: opts.take ?? 30, select: cardSelect });
}

export async function toggleBookmark(userId: string, projectId: string): Promise<ServiceResult<{ bookmarked: boolean }>> {
  const existing = await db.bookmark.findUnique({ where: { userId_projectId: { userId, projectId } }, select: { id: true } });
  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
    return { ok: true, data: { bookmarked: false } };
  }
  await db.bookmark.create({ data: { userId, projectId } });
  return { ok: true, data: { bookmarked: true } };
}
