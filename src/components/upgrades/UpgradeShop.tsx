'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useUpgrades } from '../../hooks/useUpgrades'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { UpgradeCard } from './UpgradeCard'

export function UpgradeShop() {
  const { t, i18n } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { balance, isLoading: balanceLoading, applyBalance } = useBalance({
    enabled: loggedIn,
  })
  const { upgrades, isLoading, buyingId, error, buyUpgrade } = useUpgrades({
    enabled: loggedIn,
  })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  async function handleBuy(upgradeId: number) {
    const result = await buyUpgrade(upgradeId)
    if (result) applyBalance(result.balance)
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-cd-muted">{t('upgrades.loginHint')}</p>
        <Link
          href="/login"
          className="cursor-pointer rounded-md bg-cd-accent px-6 py-3 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
        >
          {t('upgrades.loginCta')}
        </Link>
      </div>
    )
  }

  if (isLoading || balanceLoading) {
    return (
      <p role="status" className="py-10 text-center text-sm text-cd-muted">
        {t('upgrades.loading')}
      </p>
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('upgrades.eyebrow')}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('upgrades.title')}
          </h1>
          <p className="mt-1 max-w-xl text-cd-muted">{t('upgrades.subtitle')}</p>
        </div>
        {balance !== null ? (
          <p className="font-display text-lg font-semibold tabular-nums text-cd-accent">
            {t('upgrades.balance', { amount: formatClickDollars(balance, i18n.language) })}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {upgrades.length === 0 ? (
        <p className="text-sm text-cd-muted">{t('upgrades.empty')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              balance={balance}
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
