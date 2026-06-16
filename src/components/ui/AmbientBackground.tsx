import { cn } from '@/lib/utils';

/**
 * Ambient page atmosphere: a deep-space base, two soft brand orbs,
 * a faint dotted grid, and film grain to kill gradient banding.
 * Purely decorative → aria-hidden, fixed, pointer-events-none.
 */
export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden grain', className)}
    >
      {/* Base vignette */}
      <div className="absolute inset-0 bg-base" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(56,189,248,0.10),transparent_55%)]" />

      {/* Drifting orbs */}
      <div className="absolute -left-32 top-[-10%] h-[44rem] w-[44rem] rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div
        className="absolute -right-40 top-[20%] h-[40rem] w-[40rem] rounded-full bg-iris/20 blur-[150px] animate-float"
        style={{ animationDelay: '-3s' }}
      />
      <div className="absolute bottom-[-15%] left-1/3 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-[150px]" />

      {/* Dotted grid, fading toward the bottom */}
      <div
        className="absolute inset-0 opacity-[0.5] mask-fade-b"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
