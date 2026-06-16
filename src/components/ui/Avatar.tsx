import { cn } from '@/lib/utils';

/**
 * Gradient monogram avatar — zero network requests, perfect CLS, always on-brand.
 * Deterministic hue from the name so each person keeps a stable identity color.
 */
function hueFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function Avatar({
  name,
  size = 44,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const hue = hueFromName(name);

  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-full font-display font-semibold text-white/90 ring-1 ring-white/15', className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue} 70% 52%), hsl(${(hue + 40) % 360} 72% 42%))`,
      }}
    >
      {initials}
    </span>
  );
}
