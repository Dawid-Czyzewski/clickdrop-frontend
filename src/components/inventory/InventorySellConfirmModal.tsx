'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { useModalA11y } from '../../hooks/useModalA11y'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type InventorySellConfirmModalProps = {
  count: number
  estimatedTotal: number
  isSelling: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function InventorySellConfirmModal({
  count,
  estimatedTotal,
  isSelling,
  onConfirm,
  onCancel,
}: InventorySellConfirmModalProps) {
  const { t, i18n } = useTranslation()
  const handleCancel = useCallback(() => {
    if (!isSelling) onCancel()
  }, [isSelling, onCancel])
  const dialogRef = useModalA11y({ onClose: handleCancel })

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 px-3 py-4 outline-none sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-sell-confirm-title"
      onClick={handleCancel}
    >
      <div
        className="mb-[env(safe-area-inset-bottom,0px)] w-full max-w-md rounded-xl border border-cd-border bg-cd-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="inventory-sell-confirm-title"
          className="font-display text-lg font-semibold text-cd-text"
        >
          {t('inventory.sellConfirmTitle')}
        </h2>
        <p className="mt-2 text-sm text-cd-muted">
          {t('inventory.sellConfirmBody', {
            count,
            amount: formatClickDollars(estimatedTotal, i18n.language),
          })}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSelling}
            onClick={handleCancel}
            className={`${cdBtnGhost} min-h-11 px-4`}
          >
            {t('inventory.sellConfirmCancel')}
          </button>
          <button
            type="button"
            disabled={isSelling}
            aria-busy={isSelling || undefined}
            onClick={onConfirm}
            className={`${cdBtnPrimary} min-h-11 px-4`}
          >
            {isSelling ? t('inventory.sellingBatch') : t('inventory.sellConfirmCta')}
          </button>
        </div>
      </div>
    </div>
  )
}
