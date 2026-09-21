'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useBalance } from '../../hooks/useBalance'
import { useCases } from '../../hooks/useCases'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { CaseShopCard } from './CaseShopCard'

export function CasesShop() {
  const { t, i18n } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { cases, isLoading: casesLoading, error: casesError } = useCases({ enabled: true })
  const { balance, isLoading: balanceLoading } = useBalance({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (casesLoading || (loggedIn && balanceLoading)) {
    return (
      <p id="cases" role="status" className="py-10 text-center text-sm text-cd-muted">
        {t('cases.loading')}
      </p>
    )
  }

  return (
    <div id="cases" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('cases.eyebrow')}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('cases.title')}
          </h1>
          <p className="mt-1 max-w-xl text-cd-muted">{t('cases.subtitle')}</p>
        </div>
        {loggedIn && balance !== null ? (
          <p className="font-display text-lg font-semibold tabular-nums text-cd-accent">
            {t('cases.balance', { amount: formatClickDollars(balance, i18n.language) })}
          </p>
        ) : (
          <Link
            href="/login"
            className="cursor-pointer rounded-md bg-cd-accent px-4 py-2 font-display text-xs font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
          >
            {t('cases.loginCta')}
          </Link>
        )}
      </div>

      {casesError ? (
        <p role="alert" className="text-sm text-cd-danger">
          {casesError}
        </p>
      ) : null}

      {!loggedIn ? (
        <p className="text-sm text-cd-muted">{t('cases.loginHint')}</p>
      ) : null}

      {cases.length === 0 ? (
        <p className="text-sm text-cd-muted">{t('cases.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cases.map((gameCase) => (
            <CaseShopCard key={gameCase.id} gameCase={gameCase} />
          ))}
        </div>
      )}
    </div>
  )
}
