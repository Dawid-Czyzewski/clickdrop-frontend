'use client'

import { useTranslation } from 'react-i18next'
import type { OpenCaseResponse } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  itemNameKey,
  RARITY_COLOR,
  rarityLabelKey,
} from '../../lib/caseI18n'

export type SkinDropResult = Pick<
  OpenCaseResponse,
  'inventoryItemId' | 'itemCode' | 'rarity' | 'exterior' | 'suggestedSellPrice'
>

type CaseOpenResultModalProps = {
  drop: SkinDropResult
  isSelling: boolean
  onKeep: () => void
  onSell: () => void
}

export function CaseOpenResultModal({
  drop,
  isSelling,
  onKeep,
  onSell,
}: CaseOpenResultModalProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-drop-title"
    >
      <div
        className="w-full max-w-md rounded-lg border bg-cd-surface p-6 text-center shadow-xl"
        style={{ borderColor: `${color}88` }}
      >
        <p className="font-display text-xs tracking-[0.2em] uppercase" style={{ color }}>
          {t(rarityLabelKey(drop.rarity))}
        </p>
        <h2 id="case-drop-title" className="mt-2 font-display text-2xl font-bold text-cd-text">
          {t(itemNameKey(drop.itemCode))}
        </h2>
        <p className="mt-1 text-sm text-cd-muted">{t(exteriorLabelKey(drop.exterior))}</p>

        <div
          className="mx-auto mt-5 flex h-28 w-40 items-center justify-center rounded-md border"
          style={{
            borderColor: color,
            background: `radial-gradient(circle at 50% 40%, ${color}33, transparent 70%)`,
          }}
          aria-hidden="true"
        >
          <span className="font-display text-3xl font-bold" style={{ color }}>
            ★
          </span>
        </div>

        <p className="mt-4 text-sm text-cd-muted">
          {t('cases.suggestedSell', {
            amount: formatClickDollars(drop.suggestedSellPrice, i18n.language),
          })}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onKeep}
            disabled={isSelling}
            className="cursor-pointer flex-1 rounded-md border border-cd-border bg-cd-bg px-4 py-2.5 text-sm font-medium text-cd-text transition hover:bg-cd-surface-hover disabled:opacity-50"
          >
            {t('cases.keep')}
          </button>
          <button
            type="button"
            onClick={onSell}
            disabled={isSelling}
            aria-busy={isSelling || undefined}
            className="cursor-pointer flex-1 rounded-md bg-cd-accent px-4 py-2.5 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover disabled:opacity-50"
          >
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
