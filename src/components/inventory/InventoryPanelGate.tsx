'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CatalogSkeleton } from '../ui/Skeleton'
import { cdBtnPrimaryLink, cdBodyMuted, cdEyebrow, cdPageTitle } from '../ui/uiStyles'

export function InventoryLoginGate() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className={cdBodyMuted}>{t('inventory.loginHint')}</p>
      <Link href="/login" className={cdBtnPrimaryLink}>
        {t('inventory.loginCta')}
      </Link>
    </div>
  )
}

export function InventoryLoadingGate() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('inventory.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('inventory.title')}</h1>
      </div>
      <CatalogSkeleton
        count={6}
        colsClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      />
    </div>
  )
}
