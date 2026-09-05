'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { formatClickDollars } from '../../lib/formatClickDollars'

export function EarnMoneyPanel() {
  const { t, i18n } = useTranslation()
  const loggedIn = authService.hasActiveSession()
  const { user, isLoading } = useCurrentUser({ enabled: loggedIn })

  const balance =
    loggedIn && user
      ? formatClickDollars(user.clickDollars, i18n.language)
      : null

  return (
    <section
      className="cd-fade-in relative overflow-hidden rounded-lg border border-cd-border bg-cd-surface/60"
      aria-labelledby="earn-panel-title"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.18), transparent 50%), linear-gradient(120deg, #12141c 0%, #0a0b0f 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-9">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
            {t('home.earn.eyebrow')}
          </p>
          <h1 id="earn-panel-title" className="font-display text-2xl font-bold tracking-wide text-cd-text sm:text-3xl">
            {t('home.earn.title')}
          </h1>
          <p className="max-w-md text-base text-cd-muted">{t('home.earn.subtitle')}</p>

          <div className="mt-2 flex items-baseline gap-2" aria-live="polite">
            <span className="text-sm font-medium uppercase tracking-wider text-cd-muted">
              {t('home.earn.balance')}
            </span>
            {isLoading ? (
              <span role="status" className="text-sm text-cd-muted">
                {t('home.earn.loadingBalance')}
              </span>
            ) : (
              <span className="font-display text-2xl font-semibold tabular-nums text-cd-accent">
                {balance ?? t('home.earn.guestBalance')}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {loggedIn ? (
            <button
              type="button"
              className="cursor-pointer rounded-md bg-cd-accent px-6 py-3 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover"
            >
              {t('home.earn.cta')}
            </button>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer rounded-md bg-cd-accent px-6 py-3 text-center font-display text-sm font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover"
            >
              {t('home.earn.loginCta')}
            </Link>
          )}
          <p className="text-xs text-cd-muted">{t('home.earn.comingSoon')}</p>
        </div>
      </div>
    </section>
  )
}
