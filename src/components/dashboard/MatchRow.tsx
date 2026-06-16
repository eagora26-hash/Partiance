'use client';

import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

type Match = {
  id: string;
  score: number;
  reasons: string[];
  source: { name: string | null; profile: { headline: string | null; city: string | null } | null };
};

/**
 * A single match row that ALWAYS explains the match (MATCHING_ENGINE rule —
 * never show a bare percentage). Reasons are i18n keys produced by the algorithm.
 */
export function MatchRow({ match }: { match: Match }) {
  const t = useTranslations();
  const name = match.source.name ?? '—';
  const subtitle = match.source.profile?.headline ?? match.source.profile?.city ?? '';

  return (
    <li className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={40} />
        <div>
          <p className="text-body-sm font-medium text-ink">{name}</p>
          {subtitle && <p className="text-micro text-muted">{subtitle}</p>}
          <div className="mt-1 flex flex-wrap gap-1">
            {match.reasons.slice(0, 3).map((r) => (
              <span key={r} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[0.65rem] text-muted">
                {t(r as never)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Badge tone="success" className="self-start sm:self-center">
        {match.score}%
      </Badge>
    </li>
  );
}
