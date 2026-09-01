import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../dashboard/formatClickDollars'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { HeaderUserStats, HeaderUserStatsLoading } from './HeaderUserStats'

export function HeaderUserStatsPanel() {
  const { t, i18n } = useTranslation()
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
      clickDollars={formatClickDollars(user.clickDollars, i18n.language)}
      levelLabel={t('home.header.level')}
      xpLabel={t('home.header.xp')}
      clickDollarsLabel={t('home.header.clickDollars')}
    />
  )
}
