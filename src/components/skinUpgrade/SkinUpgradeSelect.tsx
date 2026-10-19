'use client'

import { useTranslation } from 'react-i18next'
import type { InventoryItem } from '../../api/casesApi'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'
import { cdBodyMuted, cdSectionLabel } from '../ui/uiStyles'

type SkinUpgradeSelectProps = {
  items: InventoryItem[]
  selectedId: number | null
  disabled: boolean
  onSelect: (inventoryItemId: number) => void
  labelKey?: 'selectLabel' | 'changeSkinLabel'
  variant?: 'grid' | 'strip'
}

export function SkinUpgradeSelect({
  items,
  selectedId,
  disabled,
  onSelect,
  labelKey = 'selectLabel',
  variant = 'grid',
}: SkinUpgradeSelectProps) {
  const { t, i18n } = useTranslation()

  if (items.length === 0) {
    return <p className={cdBodyMuted}>{t('skinUpgrade.emptyInventory')}</p>
  }

  const strip = variant === 'strip'

  return (
    <div className={`flex flex-col ${strip ? 'gap-2' : 'gap-3'}`}>
      <p className={cdSectionLabel}>{t(`skinUpgrade.${labelKey}`)}</p>
      <div
        className={
          strip
            ? 'flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:auto] [scrollbar-width:thin]'
            : 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        }
      >
        {items.map((item) => {
          const color = RARITY_COLOR[item.rarity] ?? '#8b92a5'
          const name = resolveItemLabel(t, item.code, item.displayName)
          const selected = selectedId === item.inventoryItemId

          return (
            <button
              key={item.inventoryItemId}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              title={name}
              onClick={() => onSelect(item.inventoryItemId)}
              className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${
                strip ? 'w-[5.75rem] shrink-0' : ''
              } ${
                selected
                  ? 'border-cd-accent bg-cd-surface ring-1 ring-cd-accent/50'
                  : 'border-cd-border bg-cd-surface/80 hover:border-cd-accent/45'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
              <div className={`flex flex-col ${strip ? 'gap-1 p-1.5' : 'gap-2 p-2.5'}`}>
                <div
                  className={`flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 ${
                    strip ? 'p-0.5' : 'p-1'
                  }`}
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
                <div className="min-w-0">
                  <p
                    className={`truncate font-display font-semibold text-cd-text ${
                      strip ? 'text-[0.65rem] leading-tight' : 'mt-0.5 text-sm'
                    }`}
                  >
                    {name}
                  </p>
                  {!strip ? (
                    <>
                      <p
                        className="truncate text-[0.6rem] font-medium tracking-wide uppercase"
                        style={{ color }}
                      >
                        {t(rarityLabelKey(item.rarity))}
                      </p>
                      <p className="text-xs text-cd-muted">
                        {formatClickDollars(item.suggestedSellPrice, i18n.language)} CD
                      </p>
                      {item.statTrack ? (
                        <div className="mt-1">
                          <StatTrackBadge />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <p className="truncate text-[0.6rem] text-cd-muted">
                        {formatClickDollars(item.suggestedSellPrice, i18n.language)} CD
                      </p>
                      {item.statTrack ? (
                        <div className="mt-0.5">
                          <StatTrackBadge />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
