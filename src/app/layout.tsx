import type { ReactNode } from 'react';
import '@/styles/globals.css';

/**
 * Root layout is intentionally thin: next-intl's localized layout
 * (src/app/[locale]/layout.tsx) sets <html lang> and fonts per request.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
