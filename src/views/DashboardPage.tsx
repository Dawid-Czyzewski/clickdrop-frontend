'use client'

import { useTranslation } from 'react-i18next'
import { DashboardProfile } from '../components/dashboard/DashboardProfile'
import { SiteHeader } from '../components/home/SiteHeader'
import { useCurrentUser } from '../hooks/useCurrentUser'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user, isLoading, error } = useCurrentUser()

  return (
    <div className="min-h-svh bg-cd-bg text-cd-text">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-wide text-cd-text">
            {t('dashboard.title')}
          </h1>
          <p className="text-base text-cd-muted">{t('dashboard.welcome')}</p>
        </header>

        {isLoading ? (
          <p role="status" className="text-base text-cd-muted">
            {t('dashboard.loading')}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="text-base text-cd-danger">
            {error}
          </p>
        ) : null}

        {user ? <DashboardProfile user={user} /> : null}
      </main>
    </div>
  )
}
