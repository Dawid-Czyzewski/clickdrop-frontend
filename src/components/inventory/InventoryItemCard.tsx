'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'
import { cdBtnPrimary } from '../ui/uiStyles'

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
  const name = resolveItemLabel(t, item.code, item.displayName)

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80">
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex flex-col gap-2 p-2.5">
        <div
          className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 p-1"
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
          {item.statTrack ? (
            <div className="pointer-events-none absolute top-1.5 left-1.5 z-20">
              <StatTrackBadge />
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="text-[0.6rem] font-medium tracking-wide uppercase" style={{ color }}>
            {t(rarityLabelKey(item.rarity))}
          </p>
          <h2 className="mt-0.5 truncate font-display text-sm font-semibold text-cd-text">{name}</h2>
          <p className="truncate text-xs text-cd-muted">{t(exteriorLabelKey(item.exterior))}</p>
        </div>

        <button
          type="button"
          disabled={disabled || isSelling}
          aria-busy={isSelling || undefined}
          onClick={() => onSell(item.inventoryItemId)}
          className={`${cdBtnPrimary} h-9 w-full cursor-pointer px-2 text-[0.65rem]`}
        >
          {isSelling
            ? t('inventory.selling')
            : t('inventory.sell', {
                amount: formatClickDollars(item.suggestedSellPrice, i18n.language),
              })}
        </button>
      </div>
    </article>
  )
}
