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
        // Tighter eyebrow→title gap, a touch more air before the subtitle —
        // a more deliberate vertical cadence than a uniform stack.
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <Reveal className="mb-5">
          <Badge tone="glass" dot>
            {eyebrow}
          </Badge>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2 className={cn('max-w-3xl text-balance text-h2 font-bold text-ink', align === 'center' && 'mx-auto')}>
          {titleNode}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.14}>
          <p
            className={cn(
              'mt-4 max-w-prose text-balance text-body leading-relaxed text-muted',
              align === 'center' && 'mx-auto'
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
