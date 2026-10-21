'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import type { InventoryFilterState } from '../../lib/inventoryFilters'
import { cdBodyMuted, cdBtnGhost } from '../ui/uiStyles'
import { InventoryFilters } from './InventoryFilters'
import { InventoryItemCard } from './InventoryItemCard'
import { InventorySelectionBar } from './InventorySelectionBar'

type InventoryBrowseSectionProps = {
  items: InventoryItem[]
  visibleItems: InventoryItem[]
  filters: InventoryFilterState
  hasActiveFilters: boolean
  selectedIds: number[]
  estimatedTotal: number
  sellingId: number | null
  isSellingBatch: boolean
  busy: boolean
  onFiltersChange: (patch: Partial<InventoryFilterState>) => void
  onClearFilters: () => void
  onSelectAll: () => void
  onClearSelection: () => void
  onSellSelected: () => void
  onToggleSelect: (inventoryItemId: number) => void
  onSell: (inventoryItemId: number) => void
}

export function InventoryBrowseSection({
  items,
  visibleItems,
  filters,
  hasActiveFilters,
  selectedIds,
  estimatedTotal,
  sellingId,
  isSellingBatch,
  busy,
  onFiltersChange,
  onClearFilters,
  onSelectAll,
  onClearSelection,
  onSellSelected,
  onToggleSelect,
  onSell,
}: InventoryBrowseSectionProps) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return <p className={cdBodyMuted}>{t('inventory.empty')}</p>
  }

  return (
    <>
      <InventoryFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onChange={onFiltersChange}
        onClear={onClearFilters}
      />

      {visibleItems.length > 0 ? (
        <InventorySelectionBar
          selectedCount={selectedIds.length}
          estimatedTotal={estimatedTotal}
          isSelling={isSellingBatch}
          onSelectAll={onSelectAll}
          onClear={onClearSelection}
          onSellSelected={onSellSelected}
        />
      ) : null}

      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className={cdBodyMuted}>{t('inventory.filtersEmpty')}</p>
          <button type="button" onClick={onClearFilters} className={cdBtnGhost}>
            {t('inventory.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visibleItems.map((item) => (
            <InventoryItemCard
              key={item.inventoryItemId}
              item={item}
              selected={selectedIds.includes(item.inventoryItemId)}
              isSelling={sellingId === item.inventoryItemId}
              disabled={busy}
              onToggleSelect={onToggleSelect}
              onSell={onSell}
            />
          ))}
        </div>
      )}
    </>
  )
}
