'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'

type TradeUpPickCardProps = {
  item: InventoryItem
  selected: boolean
  disabled: boolean
  onToggle: (inventoryItemId: number) => void
}

export function TradeUpPickCard({
  item,
  selected,
  disabled,
  onToggle,
}: TradeUpPickCardProps) {
  const { t } = useTranslation()
  const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, item.code, item.displayName)
  const checkboxId = `trade-up-${item.inventoryItemId}`

  return (
    <article
      className={[
        'flex flex-col overflow-hidden rounded-lg border bg-cd-surface/80',
        selected ? 'border-cd-accent' : 'border-cd-border',
      ].join(' ')}
    >
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
      <label
        htmlFor={checkboxId}
        className={`flex cursor-pointer flex-col gap-2 p-2.5 ${disabled ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center gap-2">
          <input
            id={checkboxId}
            type="checkbox"
            className="h-4 w-4 accent-cd-accent"
            checked={selected}
            disabled={disabled}
            onChange={() => onToggle(item.inventoryItemId)}
          />
          <span className="text-[0.65rem] tracking-wide text-cd-muted uppercase">
            {t('tradeUp.select')}
          </span>
        </div>
        <div
          className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 p-1"
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
        <div className="min-w-0 text-center">
          <p className="text-[0.6rem] font-medium tracking-wide uppercase" style={{ color }}>
            {t(rarityLabelKey(item.rarity))}
          </p>
          <p className="mt-0.5 truncate font-display text-sm font-semibold text-cd-text">
            {name}
          </p>
          <p className="truncate text-xs text-cd-muted">{t(exteriorLabelKey(item.exterior))}</p>
          {item.statTrack ? (
            <div className="mt-1 flex justify-center">
              <StatTrackBadge />
            </div>
          ) : null}
        </div>
      </label>
    </article>
  )
}
