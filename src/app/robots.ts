import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

const BASE = (env.APP_URL || 'https://partiance.it').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep authenticated app areas out of the index.
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/onboarding', '/projects'] },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
