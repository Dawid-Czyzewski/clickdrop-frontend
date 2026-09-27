'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useInventory } from '../../hooks/useInventory'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { InventoryItemCard } from './InventoryItemCard'

export function InventoryPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { applyBalance } = useBalance({
    enabled: loggedIn,
  })
  const { items, isLoading, sellingId, error, sellItem } = useInventory({
    enabled: loggedIn,
  })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  async function handleSell(inventoryItemId: number) {
    const result = await sellItem(inventoryItemId)
    if (result) applyBalance(result.balance)
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('inventory.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('inventory.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading) {
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={cdEyebrow}>{t('inventory.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('inventory.title')}</h1>
          <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('inventory.subtitle')}</p>
        </div>
        <Link href="/skin-upgrade" className={`${cdBtnPrimaryLink} cursor-pointer`}>
          {t('inventory.upgradePage')}
        </Link>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className={cdBodyMuted}>{t('inventory.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <InventoryItemCard
              key={item.inventoryItemId}
              item={item}
              isSelling={sellingId === item.inventoryItemId}
              disabled={sellingId !== null}
              onSell={(id) => {
                void handleSell(id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
