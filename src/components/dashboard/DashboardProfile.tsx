import { useTranslation } from 'react-i18next'
import type { CurrentUser } from '../../api/usersApi'
import { DashboardStat } from './DashboardStat'
import { formatClickDollars } from './formatClickDollars'

type DashboardProfileProps = {
  user: CurrentUser
}

export function DashboardProfile({ user }: DashboardProfileProps) {
  const { t, i18n } = useTranslation()

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <DashboardStat label={t('dashboard.username')} value={user.username} />
      <DashboardStat label={t('dashboard.level')} value={String(user.level)} />
      <DashboardStat label={t('dashboard.xp')} value={String(user.experience)} />
      <DashboardStat
        label={t('dashboard.clickDollars')}
        value={formatClickDollars(user.clickDollars, i18n.language)}
      />
    </dl>
  )
}
