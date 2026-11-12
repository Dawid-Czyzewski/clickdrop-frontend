'use client'

import Link from 'next/link'
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
    <div className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-sm text-cd-muted">
        {t('inventory.selectedCount', { count: selectedCount })}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={isSelling}
          onClick={onSelectAll}
          className={`${cdBtnGhost} h-11 px-3 text-xs`}
        >
          {t('inventory.selectAll')}
        </button>
        <button
          type="button"
          disabled={selectedCount === 0 || isSelling}
          onClick={onClear}
          className={`${cdBtnGhost} h-11 px-3 text-xs`}
        >
          {t('inventory.clearSelection')}
        </button>
        <Link href="/trade-up" className={`${cdBtnGhost} col-span-2 flex h-11 items-center justify-center px-3 text-xs no-underline sm:col-span-1`}>
          {t('inventory.tradeUpLink')}
        </Link>
        <button
          type="button"
          disabled={sellDisabled}
          aria-busy={isSelling || undefined}
          onClick={onSellSelected}
          className={`${cdBtnPrimary} col-span-2 min-h-11 px-3 py-2 text-center text-xs leading-snug whitespace-normal sm:col-span-1`}
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
