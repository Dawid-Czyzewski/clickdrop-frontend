'use client'

import { useTranslation } from 'react-i18next'
import type { OpenedCaseDrop } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { CurrencyBadge } from '../ui/CurrencyBadge'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'
import { CaseOpenResultTile } from './CaseOpenResultTile'

type CaseOpenMultiResultModalProps = {
  drops: OpenedCaseDrop[]
  experienceGained?: number
  isSelling: boolean
  onKeep: () => void
  onSellAll: () => void
  onClose: () => void
}

export function CaseOpenMultiResultModal({
  drops,
  experienceGained,
  isSelling,
  onKeep,
  onSellAll,
  onClose,
}: CaseOpenMultiResultModalProps) {
  const { t, i18n } = useTranslation()
  const sellTotal = drops.reduce((sum, drop) => sum + drop.suggestedSellPrice, 0)

  function handleDismiss() {
    if (isSelling) return
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overflow-x-clip bg-[#06070a]/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-multi-drop-title"
      onClick={handleDismiss}
    >
      <button
        type="button"
        onClick={handleDismiss}
        disabled={isSelling}
        aria-label={t('cases.close')}
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-cd-border bg-cd-surface text-cd-text transition hover:border-cd-accent/60 hover:text-cd-accent disabled:opacity-50 sm:top-6 sm:right-6"
      >
        <span aria-hidden="true" className="font-display text-2xl leading-none font-semibold">
          ×
        </span>
      </button>

      <div
        className="cd-fade-in relative flex min-h-0 flex-1 flex-col px-4 py-16 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          <div className="text-center">
            <h2
              id="case-multi-drop-title"
              className="font-display text-2xl font-bold text-cd-text sm:text-3xl"
            >
              {t('cases.openCount.resultsTitle', { count: drops.length })}
            </h2>
            {experienceGained != null && experienceGained > 0 ? (
              <p className="mt-2 font-display text-sm font-semibold text-cd-accent" role="status">
                {t('cases.experienceGained', { count: experienceGained })}
              </p>
            ) : null}
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {drops.map((drop) => (
              <CaseOpenResultTile key={drop.inventoryItemId} drop={drop} />
            ))}
          </ul>

          <div className="mx-auto flex w-full max-w-lg flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={onKeep}
              disabled={isSelling}
              className={`${cdBtnGhost} h-12 flex-1 text-sm sm:text-base`}
            >
              {t('cases.openCount.keepAll')}
            </button>
            <button
              type="button"
              onClick={onSellAll}
              disabled={isSelling}
              aria-busy={isSelling || undefined}
              className={`${cdBtnPrimary} h-auto min-h-12 flex-1 gap-2 px-3 py-2 text-center text-sm leading-snug whitespace-normal sm:text-base`}
            >
              <CurrencyBadge className="shrink-0" />
              <span className="min-w-0">
                {isSelling
                  ? t('cases.openCount.sellingAll')
                  : t('cases.openCount.sellAll', {
                      amount: formatClickDollars(sellTotal, i18n.language),
                    })}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
