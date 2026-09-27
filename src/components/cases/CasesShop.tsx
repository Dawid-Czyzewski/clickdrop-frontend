'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useCases } from '../../hooks/useCases'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { CaseShopCard } from './CaseShopCard'

export function CasesShop() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { cases, isLoading: casesLoading, error: casesError } = useCases({ enabled: true })

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
      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-cd-border/80 pt-8">
        <div>
          <p className={cdEyebrow}>{t('cases.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('cases.title')}</h1>
          <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('cases.subtitle')}</p>
        </div>
        {!loggedIn ? (
          <Link href="/login" className={cdBtnPrimaryLink}>
            {t('cases.loginCta')}
          </Link>
        ) : null}
      </div>

      {casesError ? (
        <p role="alert" className="text-sm text-cd-danger">
          {casesError}
        </p>
      ) : null}

      {!loggedIn ? <p className={cdBodyMuted}>{t('cases.loginHint')}</p> : null}

      {cases.length === 0 ? (
        <p className={cdBodyMuted}>{t('cases.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cases.map((gameCase) => (
            <CaseShopCard key={gameCase.id} gameCase={gameCase} />
          ))}
        </div>
      )}
    </div>
  )
}
