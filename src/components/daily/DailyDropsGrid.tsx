'use client'

import { useTranslation } from 'react-i18next'
import type { DailyDrop } from '../../api/dailyApi'
import {
  dropChancePercent,
  formatDropChance,
  totalDropWeight,
} from '../../lib/dropChance'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'

type DailyDropsGridProps = {
  drops: DailyDrop[]
}

export function DailyDropsGrid({ drops }: DailyDropsGridProps) {
  const { t, i18n } = useTranslation()
  const sorted = [...drops].sort((a, b) => a.weight - b.weight)
  const total = totalDropWeight(sorted.map((drop) => drop.weight))

  if (drops.length === 0) {
    return <p className="text-sm text-cd-muted">{t('daily.dropsEmpty')}</p>
  }

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {sorted.map((drop) => {
        const chance = formatDropChance(dropChancePercent(drop.weight, total), i18n.language)

        if (drop.type === 'CASH') {
          return (
            <li
              key={`cash-${drop.cashAmount}-${drop.weight}`}
              className="flex flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80"
            >
              <div className="h-0.5 w-full bg-cd-accent" />
              <div className="flex flex-col p-2.5">
                <div
                  className="flex aspect-[5/4] items-center justify-center rounded-md bg-cd-bg/40"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.28), transparent 70%)',
                  }}
                  aria-hidden="true"
                >
                  <span className="font-display text-2xl font-bold text-cd-accent">$</span>
                </div>
                <p className="mt-2 text-[0.6rem] font-medium tracking-wide text-cd-accent uppercase">
                  {t('daily.cashLabel')}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-cd-text">
                  {formatClickDollars(drop.cashAmount, i18n.language)} CD
                </p>
                <p className="mt-1 font-display text-sm font-semibold tabular-nums text-cd-accent">
                  {chance}
                </p>
              </div>
            </li>
          )
        }

        const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
        const name = resolveItemLabel(t, drop.itemCode, drop.itemDisplayName)
        return (
          <li
            key={`skin-${drop.itemId}`}
            className="flex flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80"
          >
            <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
            <div className="flex flex-col p-2.5">
              <div
                className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 p-1.5"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
                }}
              >
                <AssetImage
                  kind="item"
                  code={drop.itemCode}
                  alt={name}
                  className="h-full w-full object-contain"
                />
              </div>
              <p
                className="mt-2 text-[0.6rem] font-medium tracking-wide uppercase"
                style={{ color }}
              >
                {t(rarityLabelKey(drop.rarity))}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-cd-text">{name}</p>
              <p className="mt-1 font-display text-sm font-semibold tabular-nums text-cd-accent">
                {chance}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
