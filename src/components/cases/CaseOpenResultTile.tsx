'use client'

import { useTranslation } from 'react-i18next'
import type { OpenedCaseDrop } from '../../api/casesApi'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'

type CaseOpenResultTileProps = {
  drop: OpenedCaseDrop
}

export function CaseOpenResultTile({ drop }: CaseOpenResultTileProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, drop.itemCode, drop.itemDisplayName)

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80">
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex flex-col gap-1.5 p-2.5">
        <div
          className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 p-1"
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
          {drop.statTrack ? (
            <div className="pointer-events-none absolute top-1 left-1 z-10">
              <StatTrackBadge className="px-1 py-0.5 text-[0.55rem]" />
            </div>
          ) : null}
        </div>
        <p className="text-[0.55rem] font-medium tracking-wide uppercase" style={{ color }}>
          {t(rarityLabelKey(drop.rarity))}
        </p>
        <p className="truncate font-display text-xs font-semibold text-cd-text" title={name}>
          {name}
        </p>
        <p className="truncate text-[0.7rem] text-cd-muted">
          {t(exteriorLabelKey(drop.exterior))}
        </p>
        <p className="font-display text-xs font-semibold tabular-nums text-cd-accent">
          {formatClickDollars(drop.suggestedSellPrice, i18n.language)} CD
        </p>
      </div>
    </li>
  )
}
