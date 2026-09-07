import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { HeaderUserStats, HeaderUserStatsLoading } from './HeaderUserStats'

export function HeaderUserStatsPanel() {
  const { t } = useTranslation()
  const { user, isLoading, error } = useCurrentUser({ enabled: true })

  if (isLoading) {
    return <HeaderUserStatsLoading label={t('home.header.loadingStats')} />
  }

  if (error || !user) {
    return null
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <HeaderUserStats
        level={user.level}
        experience={user.experience}
        levelLabel={t('home.header.level')}
        xpLabel={t('home.header.xp')}
      />
      <span className="hidden max-w-[140px] truncate text-sm text-cd-text lg:inline">
        {user.username}
      </span>
    </div>
  )
}
