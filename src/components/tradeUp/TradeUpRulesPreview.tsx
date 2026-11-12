'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { exteriorLabelKey, rarityLabelKey } from '../../lib/caseI18n'
import {
  averageExterior,
  nextRarity,
  resultStatTrack,
  TRADE_UP_COUNT,
  validateTradeUp,
} from '../../lib/tradeUpEligibility'
import { cdBodyMuted, cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type TradeUpRulesPreviewProps = {
  selectedItems: InventoryItem[]
  ready: boolean
  busy: boolean
  onClear: () => void
  onConfirm: () => void
}

export function TradeUpRulesPreview({
  selectedItems,
  ready,
  busy,
  onClear,
  onConfirm,
}: TradeUpRulesPreviewProps) {
  const { t } = useTranslation()
  const validation = validateTradeUp(selectedItems)
  const sampleRarity = selectedItems[0]?.rarity
  const target = sampleRarity ? nextRarity(sampleRarity) : null
  const exterior =
    selectedItems.length === TRADE_UP_COUNT
      ? averageExterior(selectedItems.map((item) => item.exterior))
      : null
  const statTrack =
    selectedItems.length === TRADE_UP_COUNT ? resultStatTrack(selectedItems) : false

  const hintKey = !validation.ok
    ? ({
        empty: 'tradeUp.hintEmpty',
        count: 'tradeUp.hintCount',
        unique: 'tradeUp.hintUnique',
        rarity: 'tradeUp.hintRarity',
        covert: 'tradeUp.hintCovert',
      } as const)[validation.reason]
    : null

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-cd-border bg-cd-surface/60 px-3 py-3 sm:px-4">
      <p className="text-sm text-cd-muted">
        {t('tradeUp.selectedCount', { count: selectedItems.length, max: TRADE_UP_COUNT })}
      </p>

      {validation.ok && target && exterior ? (
        <ul className={`list-disc space-y-1 pl-5 text-sm ${cdBodyMuted}`}>
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
          <li>{t('tradeUp.rulePool')}</li>
        </ul>
      ) : hintKey ? (
        <p className={`text-sm ${cdBodyMuted}`}>{t(hintKey)}</p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={selectedItems.length === 0 || busy}
          onClick={onClear}
          className={`${cdBtnGhost} min-h-11 px-4 text-sm`}
        >
          {t('tradeUp.clear')}
        </button>
        <button
          type="button"
          disabled={!ready || busy}
          onClick={onConfirm}
          className={`${cdBtnPrimary} min-h-11 px-4 text-sm`}
        >
          {t('tradeUp.reviewCta')}
        </button>
      </div>
    </section>
  )
}
