'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useClickPower } from '../../hooks/useClickPower'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useUpgrades } from '../../hooks/useUpgrades'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { UpgradeCard } from './UpgradeCard'

export function UpgradeShop() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { balance, isLoading: balanceLoading, applyBalance } = useBalance({
    enabled: loggedIn,
  })
  const { rewardPerClick, refresh: refreshClickPower } = useClickPower({
    enabled: loggedIn,
  })
  const { user } = useCurrentUser({ enabled: loggedIn })
  const { upgrades, isLoading, buyingId, error, buyUpgrade } = useUpgrades({
    enabled: loggedIn,
  })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  async function handleBuy(upgradeId: number) {
    const result = await buyUpgrade(upgradeId)
    if (!result) return
    applyBalance(result.balance)
    await refreshClickPower()
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('upgrades.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('upgrades.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading || balanceLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className={cdEyebrow}>{t('upgrades.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('upgrades.title')}</h1>
        </div>
        <CatalogSkeleton count={3} colsClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
      </div>
    )
  }

  if (error && upgrades.length === 0) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-cd-danger">
        {error}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={cdEyebrow}>{t('upgrades.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('upgrades.title')}</h1>
          <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('upgrades.subtitle')}</p>
        </div>
        {rewardPerClick !== null ? (
          <p className="text-sm tabular-nums text-cd-muted">
            {t('upgrades.perClick', { amount: rewardPerClick })}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {upgrades.length === 0 ? (
        <p className={cdBodyMuted}>{t('upgrades.empty')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              balance={balance}
              userLevel={user?.level}
              isBuying={buyingId === upgrade.id}
              disabled={buyingId !== null}
              onBuy={(id) => {
                void handleBuy(id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
