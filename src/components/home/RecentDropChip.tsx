'use client'

import { useTranslation } from 'react-i18next'
import type { RecentDrop } from '../../api/dropsApi'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'

type RecentDropChipProps = {
  drop: RecentDrop
}

export function RecentDropChip({ drop }: RecentDropChipProps) {
  const { t } = useTranslation()
  const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, drop.itemCode, drop.displayName)

  return (
    <li className="flex w-[8.5rem] shrink-0 flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80 sm:w-[9.5rem]">
      <div className="h-0.5 w-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex flex-col gap-1.5 p-2">
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
              <StatTrackBadge className="text-[0.55rem] px-1 py-0.5" />
            </div>
          ) : null}
        </div>
        <p className="text-[0.55rem] font-medium tracking-wide uppercase" style={{ color }}>
          {t(rarityLabelKey(drop.rarity))}
        </p>
        <p className="truncate font-display text-xs font-semibold text-cd-text" title={name}>
          {name}
        </p>
      </div>
    </li>
  )
}
