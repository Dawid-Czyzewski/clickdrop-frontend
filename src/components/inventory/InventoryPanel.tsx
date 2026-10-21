'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useInventory } from '../../hooks/useInventory'
import { useInventoryFilters } from '../../hooks/useInventoryFilters'
import { applyInventoryFilters } from '../../lib/inventoryFilters'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { InventoryBrowseSection } from './InventoryBrowseSection'
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
  const { items, isLoading, sellingId, isSellingBatch, error, sellItem, sellBatch } =
    useInventory({ enabled: loggedIn })
  const { filters, setFilters, clearFilters, hasActiveFilters } = useInventoryFilters()

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  const visibleItems = useMemo(
    () => applyInventoryFilters(items, filters, t),
    [items, filters, t],
  )

  useEffect(() => {
    const valid = new Set(visibleItems.map((item) => item.inventoryItemId))
    setSelectedIds((prev) => prev.filter((id) => valid.has(id)))
  }, [visibleItems])

  const selectedItems = visibleItems.filter((item) =>
    selectedIds.includes(item.inventoryItemId),
  )
  const estimatedTotal = selectedItems.reduce(
    (sum, item) => sum + item.suggestedSellPrice,
    0,
  )
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

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <InventoryBrowseSection
        items={items}
        visibleItems={visibleItems}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        selectedIds={selectedIds}
        estimatedTotal={estimatedTotal}
        sellingId={sellingId}
        isSellingBatch={isSellingBatch}
        busy={busy}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        onSelectAll={() =>
          setSelectedIds(visibleItems.map((item) => item.inventoryItemId))
        }
        onClearSelection={() => setSelectedIds([])}
        onSellSelected={handleSellSelected}
        onToggleSelect={(id) => {
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          )
        }}
        onSell={(id) => {
          void handleSell(id)
        }}
      />

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
