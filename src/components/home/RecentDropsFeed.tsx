'use client'

import { useTranslation } from 'react-i18next'
import { useRecentDrops } from '../../hooks/useRecentDrops'
import { CatalogSkeleton } from '../ui/Skeleton'
import { cdBodyMuted, cdEyebrow, cdSectionLabel } from '../ui/uiStyles'
import { RecentDropChip } from './RecentDropChip'

export function RecentDropsFeed() {
  const { t } = useTranslation()
  const { drops, isLoading, error } = useRecentDrops({ enabled: true })

  return (
    <section className="flex flex-col gap-3" aria-labelledby="recent-drops-heading">
      <div>
        <p className={cdEyebrow}>{t('home.recentDrops.eyebrow')}</p>
        <h2 id="recent-drops-heading" className={cdSectionLabel}>
          {t('home.recentDrops.title')}
        </h2>
        <p className={`mt-1 ${cdBodyMuted}`}>{t('home.recentDrops.subtitle')}</p>
      </div>

      {isLoading ? (
        <CatalogSkeleton count={6} colsClassName="grid-cols-3 sm:grid-cols-4 md:grid-cols-6" />
      ) : null}

      {!isLoading && error && drops.length === 0 ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && drops.length === 0 ? (
        <p className={cdBodyMuted}>{t('home.recentDrops.empty')}</p>
      ) : null}

      {!isLoading && drops.length > 0 ? (
        <ul className="m-0 flex list-none gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {drops.map((drop, index) => (
            <RecentDropChip
              key={`${drop.itemCode}-${drop.createdAt}-${index}`}
              drop={drop}
            />
          ))}
        </ul>
      ) : null}
    </section>
  )
}
