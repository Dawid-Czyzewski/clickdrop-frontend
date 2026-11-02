'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { MyLeaderboardRank } from '../../api/usersApi'
import { cdBtnPrimaryLink } from '../ui/uiStyles'

type LeaderboardMyRankBarProps = {
  loggedIn: boolean
  myRank: MyLeaderboardRank | null
  isLoading: boolean
}

export function LeaderboardMyRankBar({
  loggedIn,
  myRank,
  isLoading,
}: LeaderboardMyRankBarProps) {
  const { t } = useTranslation()

  if (!loggedIn) {
    return (
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cd-border bg-cd-surface/95 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:top-16 sm:px-4">
        <p className="text-sm text-cd-muted">{t('leaderboard.guestHint')}</p>
        <Link href="/login" className={`${cdBtnPrimaryLink} h-11 px-4 text-xs`}>
          {t('leaderboard.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading && !myRank) {
    return (
      <div className="sticky top-14 z-20 rounded-lg border border-cd-border bg-cd-surface/95 px-3 py-2.5 text-sm text-cd-muted backdrop-blur-sm sm:top-16 sm:px-4">
        {t('leaderboard.myRankLoading')}
      </div>
    )
  }

  if (!myRank) return null

  return (
    <div
      className="sticky top-14 z-20 rounded-lg border border-cd-accent/50 bg-cd-accent/10 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:top-16 sm:px-4"
      aria-label={t('leaderboard.myRankLabel')}
    >
      <p className="font-display text-sm font-semibold tracking-wide text-cd-text sm:text-base">
        {t('leaderboard.myRank', {
          rank: myRank.rank,
          level: myRank.level,
          xp: myRank.experience,
        })}
      </p>
    </div>
  )
}
