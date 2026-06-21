import type { Config } from 'tailwindcss';

/**
 * PARTIANCE DESIGN TOKENS
 * Theme: Luxury Tech Minimalism
 * Source of truth: docs/DESIGN_SYSTEM.md + DESIGN_TOKENS.md + TYPOGRAPHY_SYSTEM.md
 *
 * Colors are exposed as CSS variables (see globals.css) so the system can
 * support theming and high-contrast modes without rebuilding utilities.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' }, // content width cap per DESIGN_TOKENS
    },
    extend: {
      colors: {
        // Surfaces
        base: 'rgb(var(--c-base) / <alpha-value>)', // #050816 deep space
        surface: 'rgb(var(--c-surface) / <alpha-value>)', // #0B1120
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)', // raised cards
        // Brand
        primary: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)', // #38BDF8
          hover: 'rgb(var(--c-primary-hover) / <alpha-value>)', // #5CCCFD
        },
        accent: 'rgb(var(--c-accent) / <alpha-value>)', // #67E8F9
        iris: 'rgb(var(--c-iris) / <alpha-value>)', // #7C6CFF violet support
        // Text
        ink: 'rgb(var(--c-ink) / <alpha-value>)', // #F9FAFB
        muted: 'rgb(var(--c-muted) / <alpha-value>)', // #94A3B8
        faint: 'rgb(var(--c-faint) / <alpha-value>)', // dimmer slate
        // Semantic
        success: 'rgb(var(--c-success) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        // Bound to next/font CSS variables in layout.tsx
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // Inter (body)
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'], // Satoshi (headings)
        numeric: ['var(--font-numeric)', 'var(--font-sans)', 'sans-serif'], // General Sans (data)
      },
      fontSize: {
        // Fluid type scale (TYPOGRAPHY_SYSTEM.md), clamped for mobile-first
        micro: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        caption: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'body-sm': ['1rem', { lineHeight: '1.6' }],
        body: ['1.125rem', { lineHeight: '1.6' }],
        'body-lg': ['1.25rem', { lineHeight: '1.55' }],
        h5: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h4: ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.75rem, 1.2rem + 2.4vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 1.3rem + 3vw, 3rem)', { lineHeight: '1.12', letterSpacing: '-0.025em' }],
        h1: ['clamp(2.5rem, 1.4rem + 4.5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        hero: ['clamp(2.75rem, 1.2rem + 6.6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      },
      spacing: {
        // 8-pt system extension
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem', // 120px
        section: '6rem', // 96px section rhythm
      },
      borderRadius: {
        button: '0.875rem', // 14px
        card: '1.5rem', // 24px
        xl2: '2rem',
      },
      maxWidth: {
        content: '80rem', // 1280px
        page: '90rem', // 1440px
        prose: '46rem',
      },
      boxShadow: {
        // Soft, never heavy (DESIGN_TOKENS: no heavy shadows)
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 20px 60px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(56,189,248,0.18), 0 14px 50px -12px rgba(56,189,248,0.35)',
        'glow-soft': '0 10px 40px -16px rgba(56,189,248,0.4)',
        lift: '0 30px 80px -28px rgba(2,6,20,0.85)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, #38BDF8 0%, #67E8F9 45%, #7C6CFF 100%)',
        'ink-fade': 'linear-gradient(180deg, #F9FAFB 0%, #94A3B8 130%)',
      },
      transitionTimingFunction: {
        // Signature easing — calm, expensive
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '500': '500ms',
        '800': '800ms',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s var(--ease-premium) both',
        float: 'float 6s var(--ease-premium) infinite',
        shimmer: 'shimmer 2.2s var(--ease-premium) infinite',
        'pulse-ring': 'pulse-ring 2.4s var(--ease-premium) infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
