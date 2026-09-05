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
    <HeaderUserStats
      level={user.level}
      experience={user.experience}
      levelLabel={t('home.header.level')}
      xpLabel={t('home.header.xp')}
    />
  )
}
