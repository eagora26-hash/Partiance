#!/bin/sh
set -e

# Apply database migrations before the app starts (idempotent).
# Uses the bundled Prisma engine; safe to run on every boot.
echo "→ Applying database migrations..."
node node_modules/prisma/build/index.js migrate deploy || {
  echo "⚠ prisma migrate deploy failed; the app may not have a schema yet." >&2
}

echo "→ Starting Partiance..."
exec "$@"
