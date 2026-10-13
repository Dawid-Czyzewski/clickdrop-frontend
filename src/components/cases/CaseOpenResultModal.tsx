'use client'

import { useTranslation } from 'react-i18next'
import type { OpenedCaseDrop } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { CurrencyBadge } from '../ui/CurrencyBadge'
import { StatTrackBadge } from '../media/StatTrackBadge'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

export type SkinDropResult = OpenedCaseDrop & {
  experienceGained?: number
}

type CaseOpenResultModalProps = {
  drop: SkinDropResult
  isSelling: boolean
  onKeep: () => void
  onSell: () => void
  onClose: () => void
  backdropCodes?: string[]
}

export function CaseOpenResultModal({
  drop,
  isSelling,
  onKeep,
  onSell,
  onClose,
  backdropCodes = [],
}: CaseOpenResultModalProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, drop.itemCode, drop.itemDisplayName)
  const strip = (backdropCodes.length > 0 ? backdropCodes : [drop.itemCode]).slice(0, 8)

  function handleDismiss() {
    if (isSelling) return
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#06070a]/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-drop-title"
      onClick={handleDismiss}
    >
      <button
        type="button"
        onClick={handleDismiss}
        disabled={isSelling}
        aria-label={t('cases.close')}
        className="absolute top-4 right-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-cd-border bg-cd-surface text-cd-text transition hover:border-cd-accent/60 hover:text-cd-accent disabled:opacity-50 sm:top-6 sm:right-6"
      >
        <span aria-hidden="true" className="font-display text-2xl leading-none font-semibold">
          ×
        </span>
      </button>

      <div
        className="cd-fade-in relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-3 opacity-25 blur-md select-none"
          aria-hidden="true"
        >
          {strip.map((code, i) => (
            <div
              key={`${code}-${i}`}
              className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg sm:h-28 sm:w-40"
            >
              <AssetImage kind="item" code={code} alt="" className="h-full w-full object-contain" />
            </div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${color}55 0%, transparent 68%)`,
          }}
          aria-hidden="true"
        />

        <p
          className="relative z-10 font-display text-xs tracking-[0.28em] uppercase sm:text-sm"
          style={{ color }}
        >
          {t(rarityLabelKey(drop.rarity))}
        </p>
        <h2
          id="case-drop-title"
          className="relative z-10 mt-2 text-center font-display text-3xl font-bold text-cd-text sm:text-4xl"
        >
          {name}
        </h2>
        <p className="relative z-10 mt-1 text-sm text-cd-muted sm:text-base">
          {t(exteriorLabelKey(drop.exterior))}
        </p>
        {drop.experienceGained != null && drop.experienceGained > 0 ? (
          <p
            className="relative z-10 mt-2 font-display text-sm font-semibold text-cd-accent sm:text-base"
            role="status"
          >
            {t('cases.experienceGained', { count: drop.experienceGained })}
          </p>
        ) : null}

        <div className="relative z-10 mt-6 flex w-full max-w-xl items-center justify-center sm:mt-8">
          <div className="relative flex w-full max-w-lg items-center justify-center">
            <AssetImage
              kind="item"
              code={drop.itemCode}
              alt={name}
              className="h-auto max-h-[42vh] w-full object-contain drop-shadow-2xl"
            />
            {drop.statTrack ? (
              <div className="pointer-events-none absolute top-2 left-2 z-20 sm:top-3 sm:left-3">
                <StatTrackBadge />
              </div>
            ) : null}
          </div>
        </div>

        <p className="relative z-10 mt-6 flex items-center gap-2 text-sm text-cd-muted sm:text-base">
          <CurrencyBadge />
          {t('cases.suggestedSell', {
            amount: formatClickDollars(drop.suggestedSellPrice, i18n.language),
          })}
        </p>

        <div className="relative z-10 mt-6 flex w-full max-w-md flex-col gap-2.5 sm:mt-8 sm:flex-row">
          <button
            type="button"
            onClick={onKeep}
            disabled={isSelling}
            className={`${cdBtnGhost} h-12 flex-1 text-base`}
          >
            {t('cases.keep')}
          </button>
          <button
            type="button"
            onClick={onSell}
            disabled={isSelling}
            aria-busy={isSelling || undefined}
            className={`${cdBtnPrimary} h-12 flex-1 gap-2 text-base`}
          >
            <CurrencyBadge />
            {isSelling
              ? t('cases.selling')
              : t('cases.sellNow', {
                  amount: formatClickDollars(drop.suggestedSellPrice, i18n.language),
                })}
          </button>
        </div>
      </div>
    </div>
  )
}
