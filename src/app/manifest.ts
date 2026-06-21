import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Partiance — Build Better Together',
    short_name: 'Partiance',
    description:
      'The AI platform connecting entrepreneurs, investors and professionals in Italy to turn ideas into great businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050816',
    theme_color: '#050816',
    icons: [{ src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
  };
}
