'use client';

import { type ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** magnetic pull toward cursor (default on for primary) */
  magnetic?: boolean;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string; onClick?: never; type?: never };
type ButtonAsButton = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: 'button' | 'submit';
};
type ButtonProps = ButtonAsLink | ButtonAsButton;

type Ripple = { id: number; x: number; y: number };

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-button font-semibold tracking-tight ' +
  'overflow-hidden transition-[transform,box-shadow,color,background] duration-300 ease-premium ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap active:scale-[0.98]';

const sizes: Record<Size, string> = {
  md: 'h-12 px-5 text-body-sm min-w-[44px]',
  lg: 'h-14 px-7 text-body',
};

const variants: Record<Variant, string> = {
  primary: 'text-base bg-brand-gradient shadow-glow hover:shadow-glow-lg',
  secondary: 'text-ink glass hover:bg-white/[0.06] hover:border-primary/30 shadow-glass',
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.05]',
};

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, magnetic, iconRight, iconLeft } =
    props;

  const reduce = useReducedMotion();
  const wantMagnetic = (magnetic ?? variant === 'primary') && !reduce;

  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onMove = (e: React.MouseEvent) => {
    if (!wantMagnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  const spawnRipple = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    window.setTimeout(() => setRipples((rs) => rs.filter((rp) => rp.id !== id)), 650);
  };

  const content = (
    <>
      {/* sliding sheen on hover (primary only) */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-premium group-hover/btn:translate-x-full"
        />
      )}
      {/* primary pill: a hairline top highlight + soft inner floor so the
          gradient reads as a lit, dimensional pill rather than a flat fill. */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-button shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-2px_6px_-2px_rgba(0,0,0,0.3)]"
        />
      )}
      {/* ripples */}
      {ripples.map((rp) => (
        <span
          key={rp.id}
          aria-hidden
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 [animation:ripple_0.6s_ease-out_forwards]"
          style={{ left: rp.x, top: rp.y }}
        />
      ))}
      {iconLeft}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="relative transition-transform duration-300 ease-spring group-hover/btn:translate-x-1">
          {iconRight}
        </span>
      )}
    </>
  );

  const classes = cn(base, sizes[size], variants[variant], className);
  const style = wantMagnetic ? { x, y } : undefined;

  if ('href' in props && props.href) {
    // External / protocol links (mailto:, tel:, https://) must NOT go through the
    // locale-aware <Link>, which would prefix them and break the destination.
    const external = /^(mailto:|tel:|https?:\/\/)/.test(props.href);
    if (external) {
      const isHttp = props.href.startsWith('http');
      return (
        <motion.div style={style} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
          <a
            href={props.href}
            ref={ref}
            className={classes}
            onClick={spawnRipple}
            {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {content}
          </a>
        </motion.div>
      );
    }
    return (
      <motion.div style={style} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
        <Link href={props.href} ref={ref} className={classes} onClick={spawnRipple}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={(props as ButtonAsButton).type ?? 'button'}
      onClick={(props as ButtonAsButton).onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseDown={spawnRipple}
      style={style}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
