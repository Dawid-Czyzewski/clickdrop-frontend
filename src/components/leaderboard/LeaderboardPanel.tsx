'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { useMyLeaderboardRank } from '../../hooks/useMyLeaderboardRank'
import { CatalogSkeleton } from '../ui/Skeleton'
import { cdBodyMuted, cdEyebrow, cdPageTitle } from '../ui/uiStyles'
import { LeaderboardMyRankBar } from './LeaderboardMyRankBar'
import { LeaderboardRow } from './LeaderboardRow'

function isOwnEntry(
  username: string,
  myUsername: string | null | undefined,
): boolean {
  const a = username.trim().toLowerCase()
  const b = myUsername?.trim().toLowerCase()
  return Boolean(a && b && a === b)
}

export function LeaderboardPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { entries, isLoading, error } = useLeaderboard({ enabled: true })
  const {
    myRank,
    isLoading: myRankLoading,
    error: myRankError,
  } = useMyLeaderboardRank({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('leaderboard.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('leaderboard.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('leaderboard.subtitle')}</p>
      </div>

      <LeaderboardMyRankBar
        loggedIn={loggedIn}
        myRank={myRank}
        isLoading={myRankLoading}
      />

      {loggedIn && myRankError ? (
        <p role="alert" className="text-sm text-cd-danger">
          {myRankError}
        </p>
      ) : null}

      {isLoading ? <CatalogSkeleton count={8} colsClassName="grid-cols-1" /> : null}

      {!isLoading && error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && entries.length === 0 ? (
        <p className={cdBodyMuted}>{t('leaderboard.empty')}</p>
      ) : null}

      {!isLoading && entries.length > 0 ? (
        <div>
          <div className="mb-1 hidden grid-cols-[3rem_minmax(0,1fr)_5rem_5.5rem] gap-4 px-0 text-[0.65rem] font-medium tracking-wide text-cd-muted uppercase sm:grid">
            <span>{t('leaderboard.columns.rank')}</span>
            <span>{t('leaderboard.columns.player')}</span>
            <span className="text-right">{t('leaderboard.columns.level')}</span>
            <span className="text-right">{t('leaderboard.columns.xp')}</span>
          </div>
          <ol className="m-0 list-none border-y border-cd-border/70 p-0">
            {entries.map((entry) => (
              <LeaderboardRow
                key={`${entry.rank}-${entry.username}`}
                entry={entry}
                isSelf={isOwnEntry(entry.username, myRank?.username)}
              />
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
