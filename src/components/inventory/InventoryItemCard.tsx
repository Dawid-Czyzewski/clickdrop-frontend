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
import { ItemWearLine } from '../media/ItemWearLine'
import { StatTrackBadge } from '../media/StatTrackBadge'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type InventoryItemCardProps = {
  item: InventoryItem
  selected: boolean
  isSelling: boolean
  disabled: boolean
  onToggleSelect: (inventoryItemId: number) => void
  onInspect: (inventoryItemId: number) => void
  onSell: (inventoryItemId: number) => void
}

export function InventoryItemCard({
  item,
  selected,
  isSelling,
  disabled,
  onToggleSelect,
  onInspect,
  onSell,
}: InventoryItemCardProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, item.code, item.displayName)
  const checkboxId = `inv-select-${item.inventoryItemId}`

  return (
    <article
      className={[
        'flex flex-col overflow-hidden rounded-lg border bg-cd-surface/80',
        selected ? 'border-cd-accent' : 'border-cd-border',
      ].join(' ')}
    >
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={checkboxId}
            className="flex min-h-11 cursor-pointer items-center gap-2 text-xs text-cd-muted"
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={selected}
              disabled={disabled}
              onChange={() => onToggleSelect(item.inventoryItemId)}
              className="h-5 w-5 shrink-0 accent-cd-accent"
            />
            {t('inventory.select')}
          </label>
        </div>

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
          <ItemWearLine
            floatValue={item.floatValue}
            paintSeed={item.paintSeed}
            className="text-[0.65rem]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onInspect(item.inventoryItemId)}
            className={`${cdBtnGhost} h-10 w-full cursor-pointer px-2 text-xs`}
          >
            {t('inventory.inspect')}
          </button>
          <button
            type="button"
            disabled={disabled || isSelling}
            aria-busy={isSelling || undefined}
            onClick={() => onSell(item.inventoryItemId)}
            className={`${cdBtnPrimary} h-11 w-full cursor-pointer px-2 text-xs`}
          >
            {isSelling
              ? t('inventory.selling')
              : t('inventory.sell', {
                  amount: formatClickDollars(item.suggestedSellPrice, i18n.language),
                })}
          </button>
        </div>
      </div>
    </article>
  )
}
