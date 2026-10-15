'use client'

import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '../../api/usersApi'

type LeaderboardRowProps = {
  entry: LeaderboardEntry
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const { t } = useTranslation()
  const name = entry.username?.trim() || t('leaderboard.anonymous')

  return (
    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-cd-border/70 py-3 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_5rem_5.5rem] sm:gap-4">
      <span className="font-display text-sm font-semibold tabular-nums text-cd-accent sm:text-base">
        #{entry.rank}
      </span>
      <span className="truncate font-display text-sm font-semibold text-cd-text sm:text-base">
        {name}
      </span>
      <span className="hidden text-right text-sm tabular-nums text-cd-muted sm:block">
        {t('leaderboard.levelValue', { level: entry.level })}
      </span>
      <span className="text-right text-sm tabular-nums text-cd-text">
        <span className="sm:hidden">
          {t('leaderboard.levelValue', { level: entry.level })} ·{' '}
        </span>
        {t('leaderboard.xpValue', { xp: entry.experience })}
      </span>
    </li>
  )
}
