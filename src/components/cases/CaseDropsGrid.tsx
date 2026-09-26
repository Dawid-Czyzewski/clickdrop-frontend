'use client'

import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import {
  dropChancePercent,
  formatDropChance,
  totalDropWeight,
} from '../../lib/dropChance'
import { itemNameKey, RARITY_COLOR, rarityLabelKey } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'

type CaseDropsGridProps = {
  drops: CaseDrop[]
}

export function CaseDropsGrid({ drops }: CaseDropsGridProps) {
  const { t, i18n } = useTranslation()
  const sorted = [...drops].sort((a, b) => a.weight - b.weight)
  const total = totalDropWeight(sorted.map((drop) => drop.weight))

  if (drops.length === 0) {
    return <p className="text-sm text-cd-muted">{t('cases.dropsEmpty')}</p>
  }

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {sorted.map((drop) => {
        const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
        const chance = formatDropChance(dropChancePercent(drop.weight, total), i18n.language)
        const name = t(itemNameKey(drop.code))

        return (
          <li
            key={drop.itemId}
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
                code={drop.code}
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
