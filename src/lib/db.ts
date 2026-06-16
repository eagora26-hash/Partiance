import { PrismaClient } from '@prisma/client';

/**
 * Single Prisma instance, reused across hot-reloads in dev so we don't
 * exhaust the connection pool. This is the ONLY place the rest of the app
 * imports the DB client from (runtime_rules: UI never touches DB directly —
 * services use this, components never do).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
