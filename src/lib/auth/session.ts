import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * Server-side session helpers. `requireUser` is the guard for protected pages —
 * the middleware already redirects unauthenticated requests, this is the
 * defence-in-depth check that also gives us the typed session.
 */
export async function getSession() {
  return auth();
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return session.user;
}
