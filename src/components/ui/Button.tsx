'use client';

import { type ReactNode, useRef } from 'react';
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

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-button font-semibold tracking-tight ' +
  'transition-[background,box-shadow,color] duration-300 ease-premium ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap';

const sizes: Record<Size, string> = {
  md: 'h-12 px-5 text-body-sm min-w-[44px]', // 44px+ tap target
  lg: 'h-14 px-7 text-body',
};

const variants: Record<Variant, string> = {
  primary:
    'text-base bg-brand-gradient shadow-glow hover:shadow-glow ' +
    'bg-[length:200%_100%] hover:bg-[position:100%_0] [transition:background-position_.6s_ease,box-shadow_.3s]',
  secondary:
    'text-ink glass hover:bg-white/[0.07] shadow-glass',
  ghost: 'text-muted hover:text-ink hover:bg-white/[0.05]',
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    magnetic,
    iconRight,
    iconLeft,
  } = props;

  const reduce = useReducedMotion();
  const wantMagnetic = (magnetic ?? variant === 'primary') && !reduce;

  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18, mass: 0.4 });

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

  const content = (
    <>
      {iconLeft}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </>
  );

  const classes = cn('group/btn', base, sizes[size], variants[variant], className);
  const style = wantMagnetic ? { x, y } : undefined;

  if ('href' in props && props.href) {
    return (
      <motion.div style={style} className="inline-flex" onMouseMove={onMove} onMouseLeave={onLeave}>
        <Link href={props.href} ref={ref} className={classes}>
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
      style={style}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
