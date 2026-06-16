import { setRequestLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AlertCircle, FolderPlus, Sparkles, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { requireUser } from '@/lib/auth/session';
import { getDashboardData } from '@/services/dashboard/dashboard.service';
import { MatchRow } from '@/components/dashboard/MatchRow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  return { title: t('cards.matches') };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sessionUser = await requireUser();
  const t = await getTranslations('dashboard');

  const data = await getDashboardData(sessionUser.id);
  const user = data.user;

  // New users must finish onboarding before reaching the dashboard.
  if (!user?.profile?.onboardingCompleted) redirect('/onboarding');

  const firstName = (user?.name ?? '').split(' ')[0] || (user?.email ?? '').split('@')[0];
  const plan = user?.subscription?.plan ?? 'FREE';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h3 font-bold text-ink">{t('welcome', { name: firstName })}</h1>
        <p className="mt-1 text-body-sm text-muted">{t('subtitle')}</p>
      </div>

      {/* Email verification banner */}
      {!user?.emailVerified && (
        <div className="flex items-center gap-3 rounded-card border border-warning/30 bg-warning/10 px-5 py-3.5">
          <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
          <p className="text-caption text-warning">{t('verifyBanner')}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Matches */}
        <GlassCard className="p-6 lg:col-span-2" interactive={false}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/12 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-body font-semibold text-ink">{t('cards.matches')}</h2>
            </div>
            <span className="tnum text-caption text-faint">{data.counts.matches}</span>
          </div>

          {data.recentMatches.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <p className="text-body-sm text-muted">{t('cards.matchesEmpty')}</p>
              <Button href="/onboarding" variant="secondary" size="md">
                {t('completeProfile')}
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recentMatches.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </ul>
          )}
        </GlassCard>

        {/* Plan */}
        <GlassCard className="p-6" interactive={false}>
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-iris/12 text-iris">
              <Users className="h-4 w-4" />
            </span>
            <h2 className="text-body font-semibold text-ink">{t('cards.plan')}</h2>
          </div>
          <p className="text-h3 font-bold text-gradient">{plan}</p>
          <p className="mt-2 text-caption text-muted">
            {plan === 'FREE' ? '10 match/mese · 1 progetto' : 'Match illimitati'}
          </p>
          {plan === 'FREE' && (
            <Button href="/billing" variant="secondary" size="md" className="mt-5 w-full" magnetic={false}>
              Upgrade
            </Button>
          )}
        </GlassCard>

        {/* Projects */}
        <GlassCard className="p-6 lg:col-span-3" interactive={false}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/12 text-accent">
                <FolderPlus className="h-4 w-4" />
              </span>
              <h2 className="text-body font-semibold text-ink">{t('cards.projects')}</h2>
            </div>
            <span className="tnum text-caption text-faint">{data.counts.projects}</span>
          </div>

          {data.recentProjects.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <p className="text-body-sm text-muted">{t('cards.projectsEmpty')}</p>
              <Button href="/projects/new" size="md">
                {t('createProject')}
              </Button>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {data.recentProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-button border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-body-sm font-medium text-ink">{p.title}</span>
                  <Badge tone="muted">{p.stage}</Badge>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
