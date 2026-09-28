'use client'

import { useTranslation } from 'react-i18next'
import { useBalance } from '../../hooks/useBalance'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { levelProgress } from '../../lib/levelProgress'
import { HeaderUserStats, HeaderUserStatsLoading } from './HeaderUserStats'

export function HeaderUserStatsPanel() {
  const { t, i18n } = useTranslation()
  const { user, isLoading, error } = useCurrentUser({ enabled: true })
  const { balance } = useBalance({ enabled: true })

  if (isLoading) {
    return <HeaderUserStatsLoading label={t('home.header.loadingStats')} />
  }

  if (error || !user) {
    return null
  }

  const formattedBalance =
    balance === null ? null : formatClickDollars(balance, i18n.language)
  const progress = levelProgress(user.experience)

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <HeaderUserStats
        level={user.level}
        experience={user.experience}
        balance={formattedBalance}
        levelLabel={t('home.header.level')}
        xpLabel={t('home.header.xp')}
        xpProgressLabel={t('home.header.xpProgress', {
          current: progress.currentXp,
          needed: progress.xpForLevel,
        })}
        balanceLabel={t('home.header.cd')}
      />
      <span className="hidden max-w-[140px] truncate text-sm text-cd-text lg:inline">
        {user.username}
      </span>
    </div>
  )
}
