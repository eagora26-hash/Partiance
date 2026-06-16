import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { env, features } from '@/lib/env';
import { verifyPassword } from '@/lib/password';
import { loginSchema } from '@/lib/validations/auth';
import { authConfig } from './auth.config';
import { logger } from '@/lib/logger';

/**
 * Full Auth.js configuration (Node runtime). Credentials provider authenticates
 * against our own Postgres `users` table; OAuth providers light up only when
 * their env keys are present (provider pattern). JWT sessions so middleware can
 * authorize on the edge without a DB round-trip.
 */
const oauthProviders = [
  ...(features.googleAuth
    ? [Google({ clientId: env.AUTH_GOOGLE_ID!, clientSecret: env.AUTH_GOOGLE_SECRET! })]
    : []),
  ...(features.githubAuth
    ? [GitHub({ clientId: env.AUTH_GITHUB_ID!, clientSecret: env.AUTH_GITHUB_SECRET! })]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  secret: env.AUTH_SECRET,
  providers: [
    ...oauthProviders,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          logger.warn('auth.login.no_user_or_oauth_only', { email });
          return null;
        }

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
          logger.warn('auth.login.bad_password', { email });
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
