import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://partnerly.it/sitemap.xml',
    host: 'https://partnerly.it',
  };
}
