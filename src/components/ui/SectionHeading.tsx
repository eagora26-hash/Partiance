import { Badge } from './Badge';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  /** highlight the last word of the title with the brand gradient */
  emphasizeLast?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  emphasizeLast = false,
}: SectionHeadingProps) {
  let titleNode: React.ReactNode = title;
  if (emphasizeLast) {
    const words = title.trim().split(' ');
    const last = words.pop();
    titleNode = (
      <>
        {words.join(' ')} <span className="text-gradient">{last}</span>
      </>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <Badge tone="glass" dot>
            {eyebrow}
          </Badge>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn('max-w-3xl text-balance text-h2 font-bold text-ink', align === 'center' && 'mx-auto')}>
          {titleNode}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={cn('max-w-prose text-body text-muted', align === 'center' && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
