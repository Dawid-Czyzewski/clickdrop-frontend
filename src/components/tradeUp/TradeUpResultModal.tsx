'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { TradeUpResponse } from '../../api/tradeUpApi'
import { useModalA11y } from '../../hooks/useModalA11y'
import { SkinUpgradeSkinCard } from '../skinUpgrade/SkinUpgradeSkinCard'
import { cdBtnPrimary, cdBodyMuted } from '../ui/uiStyles'

type TradeUpResultModalProps = {
  result: TradeUpResponse
  onClose: () => void
}

export function TradeUpResultModal({ result, onClose }: TradeUpResultModalProps) {
  const { t } = useTranslation()
  const handleClose = useCallback(() => onClose(), [onClose])
  const dialogRef = useModalA11y({ onClose: handleClose })

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/75 px-3 py-4 outline-none sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-up-result-title"
      onClick={handleClose}
    >
      <div
        className="cd-trade-up-reveal mb-[env(safe-area-inset-bottom,0px)] flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-cd-accent/40 bg-cd-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p className="font-display text-[0.65rem] tracking-[0.22em] text-cd-accent uppercase">
            {t('tradeUp.resultEyebrow')}
          </p>
          <h2
            id="trade-up-result-title"
            className="mt-1 font-display text-xl font-semibold text-cd-text"
          >
            {t('tradeUp.resultTitle')}
          </h2>
          <p className={`mt-1 text-sm ${cdBodyMuted}`}>{t('tradeUp.resultBody')}</p>
        </div>

        <SkinUpgradeSkinCard
          itemCode={result.code}
          itemDisplayName={result.displayName}
          rarity={result.rarity}
          exterior={result.exterior}
          statTrack={result.statTrack}
          floatValue={result.floatValue}
          paintSeed={result.paintSeed}
          suggestedSellPrice={result.suggestedSellPrice}
          accent
          size="lg"
          label={t('tradeUp.resultLabel')}
        />

        <button type="button" onClick={handleClose} className={`${cdBtnPrimary} min-h-11 px-5`}>
          {t('tradeUp.resultContinue')}
        </button>
      </div>
    </div>
  )
}
