'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { itemNameKey, RARITY_COLOR, rarityLabelKey } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { cdBodyMuted, cdSectionLabel } from '../ui/uiStyles'

type SkinUpgradeSelectProps = {
  items: InventoryItem[]
  selectedId: number | null
  disabled: boolean
  onSelect: (inventoryItemId: number) => void
}

export function SkinUpgradeSelect({
  items,
  selectedId,
  disabled,
  onSelect,
}: SkinUpgradeSelectProps) {
  const { t, i18n } = useTranslation()

  if (items.length === 0) {
    return <p className={cdBodyMuted}>{t('skinUpgrade.emptyInventory')}</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <p className={cdSectionLabel}>{t('skinUpgrade.selectLabel')}</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => {
          const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
          const name = t(itemNameKey(item.code))
          const selected = selectedId === item.inventoryItemId

          return (
            <button
              key={item.inventoryItemId}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onSelect(item.inventoryItemId)}
              className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${
                selected
                  ? 'border-cd-accent bg-cd-surface ring-1 ring-cd-accent/50'
                  : 'border-cd-border bg-cd-surface/80 hover:border-cd-accent/45'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <div className="h-0.5 w-full" style={{ backgroundColor: color }} />
              <div
                className="flex aspect-[5/4] items-center justify-center p-1.5"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
                }}
              >
                <AssetImage
                  kind="item"
                  code={item.code}
                  alt={name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 px-2 pb-2">
                <p className="truncate text-[0.65rem] font-medium" style={{ color }}>
                  {t(rarityLabelKey(item.rarity))}
                </p>
                <p className="truncate text-xs font-semibold text-cd-text">{name}</p>
                <p className="text-[0.65rem] text-cd-muted">
                  {formatClickDollars(item.suggestedSellPrice, i18n.language)} CD
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
