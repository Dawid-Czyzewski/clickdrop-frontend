'use client'

import { useTranslation } from 'react-i18next'
import type { CaseOpenHistoryItem } from '../../api/casesApi'
import {
  exteriorLabelKey,
  RARITY_COLOR,
  rarityLabelKey,
  resolveItemLabel,
} from '../../lib/caseI18n'
import { formatDateTime } from '../../lib/formatDateTime'
import { AssetImage } from '../media/AssetImage'
import { StatTrackBadge } from '../media/StatTrackBadge'

type CaseOpenHistoryRowProps = {
  open: CaseOpenHistoryItem
}

export function CaseOpenHistoryRow({ open }: CaseOpenHistoryRowProps) {
  const { t, i18n } = useTranslation()
  const color = RARITY_COLOR[open.rarity] ?? '#8b92a5'
  const name = resolveItemLabel(t, open.itemCode, open.displayName)

  return (
    <li className="flex items-center gap-3 overflow-hidden rounded-lg border border-cd-border bg-cd-surface/80 p-2.5 sm:gap-4 sm:p-3">
      <div className="h-full w-0.5 shrink-0 self-stretch rounded-full" style={{ backgroundColor: color }} />
      <div
        className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cd-bg/40 p-1 sm:h-16 sm:w-20"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${color}22, transparent 70%)`,
        }}
      >
        <AssetImage
          kind="item"
          code={open.itemCode}
          alt={name}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[0.6rem] font-medium tracking-wide uppercase" style={{ color }}>
            {t(rarityLabelKey(open.rarity))}
          </p>
          {open.statTrack ? <StatTrackBadge className="text-[0.55rem] px-1 py-0.5" /> : null}
        </div>
        <p className="truncate font-display text-sm font-semibold text-cd-text sm:text-base">
          {name}
        </p>
        <p className="truncate text-xs text-cd-muted">{t(exteriorLabelKey(open.exterior))}</p>
      </div>
      <time
        dateTime={open.createdAt}
        className="shrink-0 text-right text-xs tabular-nums text-cd-muted sm:text-sm"
      >
        {formatDateTime(open.createdAt, i18n.language)}
      </time>
    </li>
  )
}
