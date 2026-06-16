import { db } from '@/lib/db';

/**
 * Dashboard read model — aggregates the real data a user sees on first load.
 * Pure server-side; called by the dashboard page (service layer, not the DB,
 * is what pages talk to).
 */
export async function getDashboardData(userId: string) {
  const [user, projectsCount, matchesCount, recentMatches, recentProjects] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        profile: { select: { onboardingCompleted: true, persona: true, trustScore: true } },
        subscription: { select: { plan: true, status: true } },
      },
    }),
    db.project.count({ where: { ownerId: userId } }),
    db.match.count({ where: { targetId: userId } }),
    db.match.findMany({
      where: { targetId: userId },
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        score: true,
        reasons: true,
        status: true,
        source: {
          select: { name: true, profile: { select: { headline: true, city: true, persona: true } } },
        },
      },
    }),
    db.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      select: { id: true, title: true, status: true, stage: true },
    }),
  ]);

  return {
    user,
    counts: { projects: projectsCount, matches: matchesCount },
    recentMatches,
    recentProjects,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
