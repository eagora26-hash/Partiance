import { Inter, Manrope, Instrument_Sans } from 'next/font/google';

/**
 * PARTIANCE TYPEFACES (TYPOGRAPHY_SYSTEM.md)
 *
 * The brand spec calls for Satoshi (display) + Inter (body) + General Sans (numbers).
 * Satoshi & General Sans ship from Fontshare, not Google Fonts. To keep the build
 * self-contained and instantly available (no FOUT, no external CDN, perfect CLS),
 * we use the doc-approved premium alternatives:
 *   - Display  → Manrope        (geometric, confident — stands in for Satoshi)
 *   - Body     → Inter          (exact spec)
 *   - Numerics → Instrument Sans (clean tabular figures — stands in for General Sans)
 *
 * When the licensed Satoshi/General Sans files are added to /src/fonts, swap these
 * for next/font/local — every consumer reads the CSS variables, so nothing else changes.
 */

export const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const fontDisplay = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

export const fontNumeric = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-numeric',
  weight: ['500', '600', '700'],
});

export const fontVariables = `${fontBody.variable} ${fontDisplay.variable} ${fontNumeric.variable}`;
