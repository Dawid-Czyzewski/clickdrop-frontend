'use client'

import { useTranslation } from 'react-i18next'
import type { LeaderboardEntry } from '../../api/usersApi'

type LeaderboardRowProps = {
  entry: LeaderboardEntry
  isSelf?: boolean
}

export function LeaderboardRow({ entry, isSelf = false }: LeaderboardRowProps) {
  const { t } = useTranslation()
  const name = entry.username?.trim() || t('leaderboard.anonymous')

  return (
    <li
      aria-current={isSelf ? 'true' : undefined}
      className={[
        'grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-cd-border/70 py-3 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_5rem_5.5rem] sm:gap-4',
        isSelf ? '-mx-2 rounded-md border-cd-accent/40 bg-cd-accent/10 px-2 sm:-mx-3 sm:px-3' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="font-display text-sm font-semibold tabular-nums text-cd-accent sm:text-base">
        #{entry.rank}
      </span>
      <span className="truncate font-display text-sm font-semibold text-cd-text sm:text-base">
        {name}
        {isSelf ? (
          <span className="ml-2 text-xs font-medium tracking-wide text-cd-accent uppercase">
            {t('leaderboard.youBadge')}
          </span>
        ) : null}
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
