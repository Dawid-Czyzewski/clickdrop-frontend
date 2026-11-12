'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useCollections } from '../../hooks/useCollections'
import { CatalogSkeleton } from '../ui/Skeleton'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
} from '../ui/uiStyles'
import { CollectionCard } from './CollectionCard'

export function CollectionsPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)
  const { collections, isLoading, error } = useCollections({ enabled: loggedIn })

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('collections.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('collections.loginCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className={cdEyebrow}>{t('collections.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('collections.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('collections.subtitle')}</p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <CatalogSkeleton count={4} colsClassName="grid-cols-1 sm:grid-cols-2" />
      ) : null}

      {!isLoading && collections.length === 0 ? (
        <p className={cdBodyMuted}>{t('collections.empty')}</p>
      ) : null}

      {!isLoading && collections.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {collections.map((collection) => (
            <CollectionCard key={collection.code} collection={collection} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
