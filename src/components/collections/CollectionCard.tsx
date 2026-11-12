'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { CollectionProgress } from '../../api/collectionsApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { resolveCaseLabel } from '../../lib/caseI18n'
import { cdBodyMuted } from '../ui/uiStyles'

type CollectionCardProps = {
  collection: CollectionProgress
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { t, i18n } = useTranslation()
  const name = resolveCaseLabel(t, collection.code, collection.displayName)
  const pct =
    collection.total > 0
      ? Math.min(100, Math.round((collection.owned / collection.total) * 100))
      : 0

  return (
    <Link
      href={`/collections/${encodeURIComponent(collection.code)}`}
      className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/80 p-4 no-underline transition hover:border-cd-accent/45 hover:bg-cd-surface"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold text-cd-text">{name}</h2>
          <p className={`mt-1 text-sm ${cdBodyMuted}`}>
            {t('collections.progress', {
              owned: collection.owned,
              total: collection.total,
            })}
          </p>
        </div>
        <p className="shrink-0 font-display text-sm font-semibold text-cd-accent">
          {formatClickDollars(collection.rewardCd, i18n.language)} CD
        </p>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-cd-bg"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('collections.progressBar', { name })}
      >
        <div className="h-full rounded-full bg-cd-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>

      <p className="text-xs font-medium tracking-wide text-cd-muted uppercase">
        {collection.rewardClaimed
          ? t('collections.statusClaimed')
          : collection.completed
            ? t('collections.statusReady')
            : t('collections.statusInProgress')}
      </p>
    </Link>
  )
}
