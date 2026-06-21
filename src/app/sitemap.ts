import type { MetadataRoute } from 'next';

const BASE = 'https://partiance.it';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
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
}
