'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type InventorySelectionBarProps = {
  selectedCount: number
  estimatedTotal: number
  isSelling: boolean
  onSelectAll: () => void
  onClear: () => void
  onSellSelected: () => void
}

export function InventorySelectionBar({
  selectedCount,
  estimatedTotal,
  isSelling,
  onSelectAll,
  onClear,
  onSellSelected,
}: InventorySelectionBarProps) {
  const { t, i18n } = useTranslation()
  const sellDisabled = selectedCount === 0 || isSelling

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-3 py-2.5">
      <p className="text-sm text-cd-muted">
        {t('inventory.selectedCount', { count: selectedCount })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={isSelling} onClick={onSelectAll} className={`${cdBtnGhost} h-9 px-3 text-xs`}>
          {t('inventory.selectAll')}
        </button>
        <button
          type="button"
          disabled={selectedCount === 0 || isSelling}
          onClick={onClear}
          className={`${cdBtnGhost} h-9 px-3 text-xs`}
        >
          {t('inventory.clearSelection')}
        </button>
        <button
          type="button"
          disabled={sellDisabled}
          aria-busy={isSelling || undefined}
          onClick={onSellSelected}
          className={`${cdBtnPrimary} h-9 px-3 text-xs`}
        >
          {isSelling
            ? t('inventory.sellingBatch')
            : t('inventory.sellSelected', {
                count: selectedCount,
                amount: formatClickDollars(estimatedTotal, i18n.language),
              })}
        </button>
      </div>
    </div>
  )
}
