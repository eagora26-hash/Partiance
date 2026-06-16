import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe Auth.js config (no Prisma / bcrypt / Node APIs here — this runs in
 * the middleware/edge runtime). The full config (src/lib/auth/index.ts) extends it.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  trustHost: true,
  providers: [], // declared in the Node-side config
  callbacks: {
    // Persist role + id onto the token/session.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
