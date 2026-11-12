'use client'

import { useTranslation } from 'react-i18next'
import type { ItemRarity } from '../../api/casesApi'
import { rarityLabelKey } from '../../lib/caseI18n'
import { INVENTORY_RARITIES } from '../../lib/inventoryFilters'

type TradeUpRarityFilterProps = {
  value: ItemRarity | 'all'
  onChange: (value: ItemRarity | 'all') => void
  disabled?: boolean
}

export function TradeUpRarityFilter({
  value,
  onChange,
  disabled = false,
}: TradeUpRarityFilterProps) {
  const { t } = useTranslation()

  return (
    <label className="flex flex-col gap-1 text-sm text-cd-muted sm:max-w-xs">
      <span>{t('tradeUp.filterRarity')}</span>
      <select
        className="min-h-11 rounded-md border border-cd-border bg-cd-bg px-3 text-cd-text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ItemRarity | 'all')}
        aria-label={t('tradeUp.filterRarity')}
      >
        <option value="all">{t('tradeUp.filterAll')}</option>
        {INVENTORY_RARITIES.filter((rarity) => rarity !== 'COVERT').map((rarity) => (
          <option key={rarity} value={rarity}>
            {t(rarityLabelKey(rarity))}
          </option>
        ))}
      </select>
    </label>
  )
}
