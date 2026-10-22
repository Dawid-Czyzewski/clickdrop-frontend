'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useCaseOpenHistory } from '../../hooks/useCaseOpenHistory'
import { EmptyState } from '../ui/EmptyState'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnGhost,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { CaseOpenHistoryRow } from './CaseOpenHistoryRow'

export function CaseOpenHistoryPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { opens, isLoading, error } = useCaseOpenHistory({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('cases.opens.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('cases.opens.loginCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={cdEyebrow}>{t('cases.opens.eyebrow')}</p>
          <h1 className={cdPageTitle}>{t('cases.opens.title')}</h1>
          <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('cases.opens.subtitle')}</p>
        </div>
        <Link href="/#cases" className={cdBtnGhost}>
          {t('cases.opens.backToCases')}
        </Link>
      </div>

      {isLoading ? (
        <CatalogSkeleton count={6} colsClassName="grid-cols-1" />
      ) : null}

      {!isLoading && error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && opens.length === 0 ? (
        <EmptyState
          message={t('cases.opens.empty')}
          ctaLabel={t('cases.opens.emptyCta')}
          ctaHref="/#cases"
        />
      ) : null}

      {!isLoading && opens.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {opens.map((open, index) => (
            <CaseOpenHistoryRow
              key={`${open.itemCode}-${open.createdAt}-${index}`}
              open={open}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
