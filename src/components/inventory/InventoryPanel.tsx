'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useInventory } from '../../hooks/useInventory'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { InventoryItemCard } from './InventoryItemCard'

export function InventoryPanel() {
  const { t, i18n } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { balance, isLoading: balanceLoading, applyBalance } = useBalance({
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
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-cd-muted">{t('inventory.loginHint')}</p>
        <Link
          href="/login"
          className="cursor-pointer rounded-md bg-cd-accent px-6 py-3 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
        >
          {t('inventory.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading || balanceLoading) {
    return (
      <p role="status" className="py-10 text-center text-sm text-cd-muted">
        {t('inventory.loading')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('inventory.eyebrow')}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('inventory.title')}
          </h1>
          <p className="mt-1 max-w-xl text-cd-muted">{t('inventory.subtitle')}</p>
        </div>
        {balance !== null ? (
          <p className="font-display text-lg font-semibold tabular-nums text-cd-accent">
            {t('inventory.balance', { amount: formatClickDollars(balance, i18n.language) })}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-cd-muted">{t('inventory.empty')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
