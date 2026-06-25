import createIntlMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth/auth.config';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Edge-safe auth (no Prisma/bcrypt — uses JWT session only).
const { auth } = NextAuth(authConfig);

// Routes that require an authenticated session. Locale prefix is stripped
// before matching so both `/dashboard` and `/en/dashboard` are covered.
const PROTECTED = ['/dashboard', '/onboarding', '/projects', '/messages', '/settings', '/billing'];

// Auth / account routes that depend on the database. On a landing-only host
// (Vercel) the DB lives elsewhere, so these are redirected to the canonical
// app. Active only when AUTH_REDIRECT_URL is set (it is unset on the real app
// host, so there is never a redirect loop).
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const AUTH_REDIRECT_URL = process.env.AUTH_REDIRECT_URL?.replace(/\/$/, '');

function stripLocale(pathname: string): string {
  const seg = pathname.split('/');
  if (routing.locales.includes(seg[1] as never)) {
    return '/' + seg.slice(2).join('/');
  }
  return pathname;
}

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const path = stripLocale(pathname);

  // Landing-only host → send DB-backed auth routes to the canonical app,
  // preserving the original path + query (so reset/verify tokens carry over).
  if (AUTH_REDIRECT_URL && AUTH_ROUTES.some((p) => path === p || path.startsWith(`${p}/`))) {
    return NextResponse.redirect(`${AUTH_REDIRECT_URL}${pathname}${search}`);
  }

  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));

  if (isProtected && !req.auth) {
    const locale = pathname.split('/')[1];
    const prefix = routing.locales.includes(locale as never) && locale !== routing.defaultLocale ? `/${locale}` : '';
    const url = new URL(`${prefix}/login`, req.nextUrl.origin);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Hand off to next-intl for locale negotiation/rewriting.
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
