'use client'

import { useTranslation } from 'react-i18next'
import type { DailyDrop } from '../../api/dailyApi'
import {
  dropChancePercent,
  formatDropChance,
  totalDropWeight,
} from '../../lib/dropChance'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { itemNameKey, RARITY_COLOR, rarityLabelKey } from '../../lib/caseI18n'
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
    <ul className="m-0 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {sorted.map((drop) => {
        const chance = formatDropChance(dropChancePercent(drop.weight, total), i18n.language)

        if (drop.type === 'CASH') {
          return (
            <li
              key={`cash-${drop.cashAmount}-${drop.weight}`}
              className="flex flex-col rounded-lg border border-cd-accent/40 bg-cd-surface/70 p-3"
            >
              <div
                className="flex aspect-[5/4] items-center justify-center rounded-md"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.35), transparent 70%)',
                }}
                aria-hidden="true"
              >
                <span className="font-display text-2xl font-bold text-cd-accent">$</span>
              </div>
              <p className="mt-2.5 text-[0.65rem] font-medium tracking-wide text-cd-accent uppercase">
                {t('daily.cashLabel')}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-cd-text">
                {formatClickDollars(drop.cashAmount, i18n.language)} CD
              </p>
              <p className="mt-1.5 font-display text-sm font-semibold tabular-nums text-cd-accent">
                {chance}
              </p>
            </li>
          )
        }

        const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
        const name = t(itemNameKey(drop.itemCode))
        return (
          <li
            key={`skin-${drop.itemId}`}
            className="flex flex-col rounded-lg border bg-cd-surface/70 p-3"
            style={{ borderColor: `${color}66` }}
          >
            <div
              className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md p-2"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${color}33, transparent 70%)`,
              }}
            >
              <AssetImage
                kind="item"
                code={drop.itemCode}
                alt={name}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-2.5 text-[0.65rem] font-medium tracking-wide uppercase" style={{ color }}>
              {t(rarityLabelKey(drop.rarity))}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-cd-text">{name}</p>
            <p className="mt-1.5 font-display text-sm font-semibold tabular-nums text-cd-accent">
              {chance}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
