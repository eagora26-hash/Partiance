import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server bundle for the production Docker image.
  output: 'standalone',
  // Keep native / runtime-resolved server deps external to the bundler (so they
  // are required at runtime) AND traced into the standalone output. Without
  // this, bcryptjs was omitted from the bundle and login/register crashed with
  // MODULE_NOT_FOUND in production.
  serverExternalPackages: ['bcryptjs', '@prisma/client', 'nodemailer'],
  outputFileTracingIncludes: {
    '/**': ['./node_modules/.pnpm/bcryptjs@*/node_modules/bcryptjs/**/*'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(nextConfig);
