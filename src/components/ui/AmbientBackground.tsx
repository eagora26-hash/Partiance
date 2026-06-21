import { cn } from '@/lib/utils';
import { MouseGlow } from './MouseGlow';

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
