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
import { InventorySelectionBar } from './InventorySelectionBar'
import { InventorySellConfirmModal } from './InventorySellConfirmModal'
import { InventorySoldToast } from './InventorySoldToast'

type SoldToast = {
  id: number
  amount: number
}

export function InventoryPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [soldToast, setSoldToast] = useState<SoldToast | null>(null)
  const { applyBalance } = useBalance({ enabled: loggedIn })
  const { items, isLoading, sellingId, isSellingBatch, error, sellItem, sellBatch } = useInventory({
    enabled: loggedIn,
  })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  useEffect(() => {
    const valid = new Set(items.map((item) => item.inventoryItemId))
    setSelectedIds((prev) => prev.filter((id) => valid.has(id)))
  }, [items])

  const selectedItems = items.filter((item) => selectedIds.includes(item.inventoryItemId))
  const estimatedTotal = selectedItems.reduce((sum, item) => sum + item.suggestedSellPrice, 0)
  const busy = sellingId !== null || isSellingBatch

  function showSoldToast(amount: number) {
    setSoldToast((prev) => ({ id: (prev?.id ?? 0) + 1, amount }))
  }

  async function handleSell(inventoryItemId: number) {
    const result = await sellItem(inventoryItemId)
    if (!result) return
    applyBalance(result.balance)
    showSoldToast(result.soldFor)
  }

  async function runBatchSell() {
    setConfirmOpen(false)
    const result = await sellBatch(selectedIds)
    if (!result) return
    applyBalance(result.balance)
    setSelectedIds([])
    showSoldToast(result.totalEarned)
  }

  function handleSellSelected() {
    if (selectedIds.length === 0) return
    if (selectedIds.length > 1) {
      setConfirmOpen(true)
      return
    }
    void runBatchSell()
  }

  function toggleSelect(inventoryItemId: number) {
    setSelectedIds((prev) =>
      prev.includes(inventoryItemId)
        ? prev.filter((id) => id !== inventoryItemId)
        : [...prev, inventoryItemId],
    )
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
      <div>
        <p className={cdEyebrow}>{t('inventory.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('inventory.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('inventory.subtitle')}</p>
      </div>

      {items.length > 0 ? (
        <InventorySelectionBar
          selectedCount={selectedIds.length}
          estimatedTotal={estimatedTotal}
          isSelling={isSellingBatch}
          onSelectAll={() => setSelectedIds(items.map((item) => item.inventoryItemId))}
          onClear={() => setSelectedIds([])}
          onSellSelected={handleSellSelected}
        />
      ) : null}

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
              selected={selectedIds.includes(item.inventoryItemId)}
              isSelling={sellingId === item.inventoryItemId}
              disabled={busy}
              onToggleSelect={toggleSelect}
              onSell={(id) => {
                void handleSell(id)
              }}
            />
          ))}
        </div>
      )}

      {confirmOpen ? (
        <InventorySellConfirmModal
          count={selectedIds.length}
          estimatedTotal={estimatedTotal}
          isSelling={isSellingBatch}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            void runBatchSell()
          }}
        />
      ) : null}

      {soldToast ? (
        <InventorySoldToast
          amount={soldToast.amount}
          toastKey={soldToast.id}
          onDismiss={() => setSoldToast(null)}
        />
      ) : null}
    </div>
  )
}
