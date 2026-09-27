'use client'

import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import {
  dropChancePercent,
  formatDropChance,
  totalDropWeight,
} from '../../lib/dropChance'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import {
  collapseRareSpecialDrops,
  RARE_SPECIAL_COLOR,
} from '../../lib/rareSpecial'
import { AssetImage } from '../media/AssetImage'

type CaseDropsGridProps = {
  drops: CaseDrop[]
}

export function CaseDropsGrid({ drops }: CaseDropsGridProps) {
  const { t, i18n } = useTranslation()
  const views = collapseRareSpecialDrops(drops)
  const total = totalDropWeight(drops.map((drop) => drop.weight))

  if (drops.length === 0) {
    return <p className="text-sm text-cd-muted">{t('cases.dropsEmpty')}</p>
  }

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {views.map((view) => {
        if (view.kind === 'rareSpecial') {
          const chance = formatDropChance(
            dropChancePercent(view.weight, total),
            i18n.language,
          )
          const name = t('cases.rareSpecialName')
          return (
            <li
              key="rare-special"
              className="flex flex-col overflow-hidden rounded-lg border border-[#e4ae39]/45 bg-cd-surface/80"
            >
              <div
                className="h-0.5 w-full shrink-0"
                style={{ backgroundColor: RARE_SPECIAL_COLOR }}
              />
              <div className="flex flex-col p-2.5">
                  <div
                    className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md p-1.5"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${RARE_SPECIAL_COLOR}33, transparent 70%)`,
                    }}
                  >
                    <AssetImage
                      kind="item"
                      code="RARE_SPECIAL"
                      alt={name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                <p
                  className="mt-2 text-[0.6rem] font-medium tracking-wide uppercase"
                  style={{ color: RARE_SPECIAL_COLOR }}
                >
                  {t('cases.rareSpecialRarity')}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-cd-text">{name}</p>
                <p className="mt-1 font-display text-sm font-semibold tabular-nums text-cd-accent">
                  {chance}
                </p>
              </div>
            </li>
          )
        }

        const { drop } = view
        const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
        const chance = formatDropChance(dropChancePercent(drop.weight, total), i18n.language)
        const name = resolveItemLabel(t, drop.code, drop.displayName)

        return (
          <li
            key={drop.itemId}
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
                  code={drop.code}
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
