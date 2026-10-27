'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { RecentDrop } from '../../api/dropsApi'
import { RARITY_COLOR, rarityLabelKey, resolveItemLabel } from '../../lib/caseI18n'
import { recentDropHref } from '../../lib/recentDropHref'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'

type RecentDropChipProps = {
  drop: RecentDrop
  resolvedCaseId?: number
}

function ariaLabelKey(drop: RecentDrop, caseId?: number): string {
  if (caseId != null && caseId > 0) return 'home.recentDrops.goToCase'
  if (drop.source === 'DAILY') return 'home.recentDrops.goToDaily'
  return 'home.recentDrops.goToCases'
}

export function RecentDropChip({ drop, resolvedCaseId }: RecentDropChipProps) {
  const { t } = useTranslation()
  const color = RARITY_COLOR[drop.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, drop.itemCode, drop.displayName)
  const caseId = resolvedCaseId ?? drop.caseId
  const href = recentDropHref(drop, resolvedCaseId)

  return (
    <li className="w-[8.5rem] shrink-0 sm:w-[9.5rem]">
      <Link
        href={href}
        aria-label={t(ariaLabelKey(drop, caseId), { name })}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80 no-underline transition hover:border-cd-accent/55 hover:bg-cd-surface focus-visible:border-cd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cd-accent/40"
      >
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
              alt=""
              className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.04]"
            />
            {drop.statTrack ? (
              <div className="pointer-events-none absolute top-1 left-1 z-10">
                <StatTrackBadge className="px-1 py-0.5 text-[0.55rem]" />
              </div>
            ) : null}
          </div>
          <p
            className="text-[0.55rem] font-medium tracking-wide uppercase"
            style={{ color }}
          >
            {t(rarityLabelKey(drop.rarity))}
          </p>
          <p className="truncate font-display text-xs font-semibold text-cd-text" title={name}>
            {name}
          </p>
        </div>
      </Link>
    </li>
  )
}
