import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { requireUser } from '@/lib/auth/session';

/** Authenticated app shell. Guards every child route server-side. */
export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser();

  return (
    <>
      <AmbientBackground />
      <DashboardTopbar name={user.name ?? ''} email={user.email ?? ''} />
      <div className="mx-auto max-w-content px-5 py-8">{children}</div>
    </>
  );
}
