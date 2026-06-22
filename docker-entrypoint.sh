#!/bin/sh
set -e

# Apply database migrations before the app starts (idempotent).
# Uses the flat prod node_modules (prisma CLI + engines) bundled in the image,
# pointed at the standalone app's schema. Safe to run on every boot.
echo "→ Applying database migrations..."
node ./prisma_runtime/node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma || {
  echo "⚠ prisma migrate deploy failed; the app may not have a schema yet." >&2
}

echo "→ Starting Partiance..."
exec "$@"
