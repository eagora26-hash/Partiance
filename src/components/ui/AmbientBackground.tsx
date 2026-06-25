import { cn } from '@/lib/utils';
import { MouseGlow } from './MouseGlow';
import { BrandBackdrop } from './BrandBackdrop';

/**
 * Site-wide atmosphere — layered, original, "alive".
 *  1. Graphite base + warm-teal vignette
 *  2. Mesh-gradient wash (three teal/cyan pools)
 *  3. Three aurora blobs drifting on independent timings
 *  4. A perspective grid that recedes and fades
 *  5. A cursor-following teal glow (via --mx/--my, set by MouseGlow)
 *  6. Fine film grain to kill banding
 * Purely decorative → aria-hidden, fixed, pointer-events-none.
 */
export function AmbientBackground({ className }: { className?: string }) {
  return (
    <>
      <MouseGlow />
      <div
        aria-hidden
        className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden grain', className)}
      >
        {/* 1 — base + vignette */}
        <div className="absolute inset-0 bg-base" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_-10%,rgba(20,200,188,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_120%,rgba(4,8,10,0.9),transparent)]" />

        {/* 2 — mesh-gradient wash */}
        <div className="absolute inset-0 bg-mesh-hero opacity-80" />

        {/* 2a — BRAND SCULPTURE: the Partiance mark as a premium 3D object set
            (center + left + right) floating behind the page — beveled geometry,
            polished metallic teal-cyan material, real reflections, soft contact
            shadows and a gentle volumetric bloom. Heavily dimmed + masked so it
            reads as luxury background depth, never competing with content.
            On no-WebGL / reduced-motion / phones it degrades to the flat SVG
            watermarks below (same identity, GPU-cheap). */}
        <BrandBackdrop>
          {/* center — the faint primary identity */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Partiance-fallback.svg"
            alt=""
            className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.04] blur-[3px] [mask-image:radial-gradient(closest-side,#000_35%,transparent_72%)] [-webkit-mask-image:radial-gradient(closest-side,#000_35%,transparent_72%)]"
          />
          {/* left — anchored off the left edge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Partiance-fallback.svg"
            alt=""
            className="absolute left-[-22vmin] top-[18%] hidden h-[68vmin] w-[68vmin] max-w-none -rotate-12 opacity-[0.05] blur-[2px] [mask-image:radial-gradient(closest-side,#000_30%,transparent_72%)] [-webkit-mask-image:radial-gradient(closest-side,#000_30%,transparent_72%)] md:block"
          />
          {/* right — anchored off the right edge, lower */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Partiance-fallback.svg"
            alt=""
            className="absolute right-[-24vmin] bottom-[8%] hidden h-[72vmin] w-[72vmin] max-w-none rotate-12 opacity-[0.05] blur-[2px] [mask-image:radial-gradient(closest-side,#000_30%,transparent_72%)] [-webkit-mask-image:radial-gradient(closest-side,#000_30%,transparent_72%)] md:block"
          />
        </BrandBackdrop>

        {/* 2b — volumetric light beams (god-rays) raking down from top.
            Two soft, blurred shafts on independent slow sways → atmospheric depth,
            never distracting. Pure CSS transforms (GPU). Hidden on phones — barely
            visible there and the largest animated blur layer, so we drop it to keep
            mobile compositing light. */}
        <div className="absolute inset-x-0 top-[-12%] hidden h-[85vh] overflow-hidden [mask-image:radial-gradient(75%_70%_at_50%_0%,#000_30%,transparent_78%)] md:block">
          <div
            className="absolute left-[34%] top-[-30%] h-[150%] w-[18rem] origin-top animate-beam-sway bg-[linear-gradient(180deg,rgba(46,242,222,0.16),rgba(20,200,188,0.05)_45%,transparent_75%)] blur-[60px]"
            style={{ ['--beam-rot' as string]: '13deg' }}
          />
          <div
            className="absolute left-[64%] top-[-30%] h-[150%] w-[14rem] origin-top animate-beam-sway bg-[linear-gradient(180deg,rgba(91,216,255,0.14),rgba(91,216,255,0.04)_45%,transparent_75%)] blur-[70px]"
            style={{ ['--beam-rot' as string]: '-10deg', animationDelay: '-6s', animationDuration: '20s' }}
          />
        </div>

        {/* 3 — drifting aurora blobs */}
        <div className="absolute -left-[12%] top-[-14%] h-[46rem] w-[46rem] rounded-full bg-primary/25 blur-[150px] animate-aurora" />
        <div
          className="absolute -right-[16%] top-[12%] h-[42rem] w-[42rem] rounded-full bg-iris/20 blur-[160px] animate-aurora"
          style={{ animationDelay: '-7s', animationDuration: '26s' }}
        />
        <div
          className="absolute bottom-[-18%] left-1/3 h-[40rem] w-[40rem] rounded-full bg-accent/14 blur-[170px] animate-aurora"
          style={{ animationDelay: '-13s', animationDuration: '30s' }}
        />

        {/* 4 — perspective grid, receding + fading */}
        <div className="absolute inset-x-0 top-0 h-[70vh] [perspective:600px]">
          <div
            className="absolute inset-0 bg-grid-fade bg-grid opacity-[0.6] [transform:rotateX(62deg)_scale(2)] [transform-origin:top]"
            style={{
              maskImage: 'radial-gradient(70% 60% at 50% 0%, #000 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000 30%, transparent 75%)',
            }}
          />
        </div>

        {/* 5 — cursor-following glow (reads --mx/--my off <body>) */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(360px circle at var(--mx) var(--my), rgba(46,242,222,0.08), transparent 65%)',
          }}
        />

        {/* 6 — top sheen line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </>
  );
}
