'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  itemNameKey,
  RARITY_COLOR,
  rarityLabelKey,
} from '../../lib/caseI18n'

type InventoryItemCardProps = {
  item: InventoryItem
  isSelling: boolean
  disabled: boolean
  onSell: (inventoryItemId: number) => void
}

export function InventoryItemCard({
  item,
  isSelling,
  disabled,
  onSell,
}: InventoryItemCardProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'

  return (
    <article
      className="flex flex-col gap-3 rounded-lg border bg-cd-surface/70 p-4 text-left"
      style={{ borderColor: `${color}55` }}
    >
      <div
        className="flex h-20 items-center justify-center rounded-md border"
        style={{
          borderColor: color,
          background: `radial-gradient(circle at 50% 40%, ${color}28, transparent 70%)`,
        }}
        aria-hidden="true"
      >
        <span className="font-display text-2xl font-bold" style={{ color }}>
          ★
        </span>
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide uppercase" style={{ color }}>
          {t(rarityLabelKey(item.rarity))}
        </p>
        <h2 className="mt-0.5 font-display text-base font-semibold text-cd-text">
          {t(itemNameKey(item.code))}
        </h2>
        <p className="text-sm text-cd-muted">{t(exteriorLabelKey(item.exterior))}</p>
      </div>

      <button
        type="button"
        disabled={disabled || isSelling}
        aria-busy={isSelling || undefined}
        onClick={() => onSell(item.inventoryItemId)}
        className="cursor-pointer rounded-md bg-cd-accent px-3 py-2 font-display text-xs font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSelling
          ? t('inventory.selling')
          : t('inventory.sell', {
              amount: formatClickDollars(item.suggestedSellPrice, i18n.language),
            })}
      </button>
    </article>
  )
}
