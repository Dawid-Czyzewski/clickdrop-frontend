'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { useModalA11y } from '../../hooks/useModalA11y'
import { exteriorLabelKey, rarityLabelKey } from '../../lib/caseI18n'
import {
  averageExterior,
  nextRarity,
  resultStatTrack,
  validateTradeUp,
} from '../../lib/tradeUpEligibility'
import { cdBtnGhost, cdBtnPrimary, cdBodyMuted } from '../ui/uiStyles'

type TradeUpConfirmModalProps = {
  selectedItems: InventoryItem[]
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function TradeUpConfirmModal({
  selectedItems,
  isSubmitting,
  onConfirm,
  onCancel,
}: TradeUpConfirmModalProps) {
  const { t } = useTranslation()
  const handleCancel = useCallback(() => {
    if (!isSubmitting) onCancel()
  }, [isSubmitting, onCancel])
  const dialogRef = useModalA11y({ onClose: handleCancel })

  const validation = validateTradeUp(selectedItems)
  const target =
    validation.ok ? validation.targetRarity : nextRarity(selectedItems[0]?.rarity ?? 'MIL_SPEC')
  const exterior = averageExterior(selectedItems.map((item) => item.exterior))
  const statTrack = resultStatTrack(selectedItems)

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 px-3 py-4 outline-none sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-up-confirm-title"
      onClick={handleCancel}
    >
      <div
        className="mb-[env(safe-area-inset-bottom,0px)] w-full max-w-md rounded-xl border border-cd-border bg-cd-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="trade-up-confirm-title"
          className="font-display text-lg font-semibold text-cd-text"
        >
          {t('tradeUp.confirmTitle')}
        </h2>
        <p className={`mt-2 text-sm ${cdBodyMuted}`}>{t('tradeUp.confirmBody')}</p>
        {validation.ok && target ? (
          <ul className={`mt-3 list-disc space-y-1 pl-5 text-sm ${cdBodyMuted}`}>
            <li>
              {t('tradeUp.ruleRarity', {
                from: t(rarityLabelKey(validation.rarity)),
                to: t(rarityLabelKey(target)),
              })}
            </li>
            <li>{t('tradeUp.ruleExterior', { exterior: t(exteriorLabelKey(exterior)) })}</li>
            <li>
              {statTrack ? t('tradeUp.ruleStatTrackYes') : t('tradeUp.ruleStatTrackNo')}
            </li>
          </ul>
        ) : null}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCancel}
            className={`${cdBtnGhost} min-h-11 px-4`}
          >
            {t('tradeUp.cancel')}
          </button>
          <button
            type="button"
            disabled={isSubmitting || !validation.ok}
            aria-busy={isSubmitting || undefined}
            onClick={onConfirm}
            className={`${cdBtnPrimary} min-h-11 px-4`}
          >
            {isSubmitting ? t('tradeUp.submitting') : t('tradeUp.confirmCta')}
          </button>
        </div>
      </div>
    </div>
  )
}
