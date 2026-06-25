# ============================================================
# PARTIANCE — production image (multi-stage, Next standalone + Prisma)
# Debian-based runtime (node:22-slim) so it matches Prisma's
# debian-openssl-3.0.x query engine. pnpm is pinned via the
# packageManager field; corepack fetches the exact version.
# ============================================================

# ---- deps: install with frozen lockfile ----
FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# ---- builder: generate Prisma client + build Next ----
FROM node:22-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm prisma generate
RUN pnpm build
# Build a flat, self-contained toolchain (prisma CLI + client + engines) used by
# the entrypoint to run migrations at boot. npm gives a plain hoisted layout,
# sidestepping pnpm's symlinks (which Next standalone tracing doesn't bundle).
# Versions are pinned to match the app's Prisma.
RUN mkdir -p /prod_modules && cd /prod_modules \
  && npm init -y >/dev/null 2>&1 \
  && npm install --no-audit --no-fund prisma@6.19.3 @prisma/client@6.19.3 \
  && cp /app/prisma/schema.prisma ./schema.prisma \
  && ./node_modules/.bin/prisma generate --schema=./schema.prisma

# ---- runner: minimal Debian runtime ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Next standalone server + static assets (the standalone bundle already includes
# the traced @prisma/client + query engine for runtime queries).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Flat prod node_modules (prisma CLI + client + engines) for migrate-on-boot.
COPY --from=builder --chown=nextjs:nodejs /prod_modules/node_modules ./prisma_runtime/node_modules
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
