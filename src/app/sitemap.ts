import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

// Canonical site URL. Derives from APP_URL so the sitemap is correct on any
// deployment (Render, Vercel, custom domain), falling back to the brand domain.
const BASE = (env.APP_URL || 'https://partiance.it').replace(/\/$/, '');

// Public, indexable marketing/legal pages (Italian-first: unprefixed = `it`).
const PUBLIC_PATHS = [
  '/about',
  '/contact',
  '/blog',
  '/careers',
  '/privacy',
  '/terms',
  '/cookies',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: { it: BASE, en: `${BASE}/en` } },
    },
    {
      url: `${BASE}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const pages: MetadataRoute.Sitemap = PUBLIC_PATHS.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
    alternates: { languages: { it: `${BASE}${p}`, en: `${BASE}/en${p}` } },
  }));

  return [...home, ...pages];
}
