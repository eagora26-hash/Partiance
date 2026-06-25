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
        // Surfaces — graphite deep space (from the logo)
        base: 'rgb(var(--c-base) / <alpha-value>)', // #04080A
        surface: 'rgb(var(--c-surface) / <alpha-value>)', // #091113
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)', // #0E191C raised glass
        graphite: 'rgb(var(--c-graphite) / <alpha-value>)', // #0D0F11 Partner link
        // Brand — the Alliance teal-cyan
        primary: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)', // #14C8BC
          hover: 'rgb(var(--c-primary-hover) / <alpha-value>)', // #2EF2DE
        },
        accent: 'rgb(var(--c-accent) / <alpha-value>)', // #40F8E0
        iris: 'rgb(var(--c-iris) / <alpha-value>)', // #5BD8FF cool support
        // Text — from the wordmark
        ink: 'rgb(var(--c-ink) / <alpha-value>)', // #E8F1F2
        muted: 'rgb(var(--c-muted) / <alpha-value>)', // #8AA0A2
        faint: 'rgb(var(--c-faint) / <alpha-value>)', // #5C6E70
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
        // Lower clamp floors so small phones (320–360px) scale headings DOWN
        // gracefully (no oversized text), while desktop maxima are preserved.
        h3: ['clamp(1.55rem, 1.15rem + 1.9vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.7rem, 1.15rem + 2.6vw, 3rem)', { lineHeight: '1.14', letterSpacing: '-0.025em' }],
        h1: ['clamp(2rem, 1.2rem + 4vw, 3.5rem)', { lineHeight: '1.07', letterSpacing: '-0.03em' }],
        hero: ['clamp(2.1rem, 1.1rem + 5.4vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
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
        // Soft, never heavy — glows are the Alliance teal-cyan
        glass: '0 1px 0 0 rgba(198,240,236,0.07) inset, 0 24px 70px -24px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(46,242,222,0.2), 0 16px 50px -12px rgba(20,200,188,0.4)',
        'glow-soft': '0 12px 44px -16px rgba(46,242,222,0.45)',
        'glow-lg': '0 0 0 1px rgba(46,242,222,0.22), 0 30px 90px -20px rgba(20,200,188,0.5)',
        lift: '0 36px 90px -30px rgba(0,0,0,0.9)',
        'inner-line': 'inset 0 1px 0 0 rgba(198,240,236,0.08)',
      },
      backgroundImage: {
        // Brand gradient — teal-cyan, from the Alliance link
        'brand-gradient':
          'linear-gradient(115deg, #14C8BC 0%, #2EF2DE 45%, #5BD8FF 100%)',
        'brand-gradient-soft':
          'linear-gradient(115deg, rgba(20,200,188,0.18) 0%, rgba(91,216,255,0.14) 100%)',
        'ink-fade': 'linear-gradient(180deg, #E8F1F2 0%, #8AA0A2 130%)',
        'mesh-hero':
          'radial-gradient(60% 50% at 18% 22%, rgba(20,200,188,0.22), transparent 60%),' +
          'radial-gradient(50% 45% at 82% 18%, rgba(91,216,255,0.18), transparent 62%),' +
          'radial-gradient(55% 55% at 50% 92%, rgba(46,242,222,0.14), transparent 60%)',
        'grid-fade':
          'linear-gradient(rgba(198,240,236,0.045) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(198,240,236,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '46px 46px',
        'grid-lg': '120px 120px',
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
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-22px,0)' },
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
        aurora: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)' },
          '33%': { transform: 'translate3d(4%,-3%,0) rotate(8deg) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%,4%,0) rotate(-6deg) scale(0.96)' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0deg) scale(1)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)', opacity: '0' },
          '40%, 60%': { opacity: '1' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)', opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'caret-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        // Volumetric light beam: a slow sway + breathe, sold as a god-ray shaft.
        'beam-sway': {
          '0%, 100%': { transform: 'translateX(-50%) rotate(var(--beam-rot,14deg)) scaleY(1)', opacity: '0.5' },
          '50%': { transform: 'translateX(-50%) rotate(calc(var(--beam-rot,14deg) + 4deg)) scaleY(1.08)', opacity: '0.85' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s var(--ease-premium) both',
        float: 'float 6s var(--ease-premium) infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        shimmer: 'shimmer 2.2s var(--ease-premium) infinite',
        'pulse-ring': 'pulse-ring 2.4s var(--ease-premium) infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        aurora: 'aurora 22s ease-in-out infinite',
        breathe: 'breathe 7s ease-in-out infinite',
        'shine-sweep': 'shine-sweep 5s var(--ease-premium) infinite',
        marquee: 'marquee 38s linear infinite',
        'beam-sway': 'beam-sway 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
