'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useCases } from '../../hooks/useCases'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { EmptyState } from '../ui/EmptyState'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnGhost,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { CaseShopCard } from './CaseShopCard'

export function CasesShop() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const {
    cases,
    isLoading: casesLoading,
    error: casesError,
    refresh,
  } = useCases({ enabled: true })
  const { user } = useCurrentUser({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (casesLoading) {
    return (
      <div id="cases" className="flex flex-col gap-5">
        <div>
          <p className={cdEyebrow}>{t('cases.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('cases.title')}</h1>
        </div>
        <CatalogSkeleton />
      </div>
    )
  }

  return (
    <div id="cases" className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-t border-cd-border/80 pt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className={cdEyebrow}>{t('cases.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('cases.title')}</h1>
          <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('cases.subtitle')}</p>
        </div>
        {!loggedIn ? (
          <Link href="/login" className={`${cdBtnPrimaryLink} w-full sm:w-auto`}>
            {t('cases.loginCta')}
          </Link>
        ) : (
          <Link href="/cases/opens" className={`${cdBtnGhost} w-full sm:w-auto`}>
            {t('cases.opens.historyLink')}
          </Link>
        )}
      </div>

      {casesError ? (
        <div className="flex flex-col gap-2" role="alert">
          <p className="text-sm text-cd-danger">{casesError}</p>
          <EmptyState
            message={t('cases.errorHint')}
            ctaLabel={t('cases.retry')}
            onCtaClick={refresh}
            secondaryLabel={t('cases.homeCta')}
            secondaryHref="/"
          />
        </div>
      ) : null}

      {!loggedIn && !casesError ? (
        <p className={cdBodyMuted}>{t('cases.loginHint')}</p>
      ) : null}

      {!casesError && cases.length === 0 ? (
        <EmptyState
          message={t('cases.empty')}
          ctaLabel={t('cases.retry')}
          onCtaClick={refresh}
          secondaryLabel={t('cases.homeCta')}
          secondaryHref="/"
        />
      ) : null}

      {!casesError && cases.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cases.map((gameCase) => (
            <CaseShopCard
              key={gameCase.id}
              gameCase={gameCase}
              userLevel={user?.level ?? null}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
