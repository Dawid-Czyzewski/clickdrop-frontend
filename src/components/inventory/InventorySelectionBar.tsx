'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type InventorySelectionBarProps = {
  selectedCount: number
  estimatedTotal: number
  isSelling: boolean
  canTradeUp: boolean
  isTradingUp: boolean
  onSelectAll: () => void
  onClear: () => void
  onSellSelected: () => void
  onTradeUp: () => void
}

export function InventorySelectionBar({
  selectedCount,
  estimatedTotal,
  isSelling,
  canTradeUp: tradeUpReady,
  isTradingUp,
  onSelectAll,
  onClear,
  onSellSelected,
  onTradeUp,
}: InventorySelectionBarProps) {
  const { t, i18n } = useTranslation()
  const busy = isSelling || isTradingUp
  const sellDisabled = selectedCount === 0 || busy

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-sm text-cd-muted">
        {t('inventory.selectedCount', { count: selectedCount })}
        {!tradeUpReady && selectedCount > 0 ? (
          <span className="mt-1 block text-xs">{t('inventory.tradeUpHint')}</span>
        ) : null}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled={busy}
          onClick={onSelectAll}
          className={`${cdBtnGhost} h-11 px-3 text-xs`}
        >
          {t('inventory.selectAll')}
        </button>
        <button
          type="button"
          disabled={selectedCount === 0 || busy}
          onClick={onClear}
          className={`${cdBtnGhost} h-11 px-3 text-xs`}
        >
          {t('inventory.clearSelection')}
        </button>
        <button
          type="button"
          disabled={!tradeUpReady || busy}
          aria-busy={isTradingUp || undefined}
          onClick={onTradeUp}
          className={`${cdBtnGhost} col-span-2 min-h-11 px-3 py-2 text-center text-xs leading-snug sm:col-span-1`}
        >
          {isTradingUp ? t('inventory.tradingUp') : t('inventory.tradeUp')}
        </button>
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
