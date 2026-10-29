'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { performSessionLogout } from '../../auth/performSessionLogout'
import { setAppLanguage } from '../../i18n/setAppLanguage'
import { HeaderUserStatsPanel } from './HeaderUserStatsPanel'

export function SiteHeader() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  function handleLogout() {
    void performSessionLogout((path) => {
      setLoggedIn(false)
      router.push(path)
    })
  }

  return (
    <header className="border-b border-cd-border bg-cd-bg-elevated/90 backdrop-blur-md">
      <div className="flex h-14 w-full items-center gap-4 px-3 sm:h-16 sm:px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 no-underline">
          <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
            <defs>
              <linearGradient id="cd-header-logo" x1="8" y1="4" x2="56" y2="60">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
              stroke="url(#cd-header-logo)"
              strokeWidth="2.5"
              fill="rgba(245,158,11,0.1)"
            />
            <path d="M32 14L22 36H30L28 50L42 28H34L36 14H32Z" fill="url(#cd-header-logo)" />
          </svg>
          <span className="font-display text-sm font-semibold tracking-[0.14em] text-cd-text sm:text-base">
            CLICK<span className="text-cd-accent">DROP</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1" role="group" aria-label={t('language.label')}>
            <button
              type="button"
              onClick={() => void setAppLanguage('pl')}
              className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition ${
                i18n.language.startsWith('pl')
                  ? 'bg-cd-accent text-cd-bg'
                  : 'text-cd-muted hover:text-cd-text'
              }`}
            >
              PL
            </button>
            <button
              type="button"
              onClick={() => void setAppLanguage('en')}
              className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition ${
                i18n.language.startsWith('en')
                  ? 'bg-cd-accent text-cd-bg'
                  : 'text-cd-muted hover:text-cd-text'
              }`}
            >
              EN
            </button>
          </div>

          {loggedIn ? (
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
              <HeaderUserStatsPanel />
              <Link
                href="/settings"
                className="hidden cursor-pointer rounded-md border border-cd-border bg-cd-surface px-3 py-1.5 text-sm font-medium text-cd-text no-underline transition hover:bg-cd-surface-hover sm:inline-flex"
              >
                {t('home.header.settings')}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-md border border-cd-border bg-cd-surface px-2.5 py-1.5 text-sm font-medium text-cd-text transition hover:bg-cd-surface-hover sm:px-3"
              >
                {t('home.header.logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer rounded-md bg-cd-accent px-4 py-1.5 font-display text-xs font-semibold tracking-wider text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover sm:px-5 sm:text-sm"
            >
              {t('home.header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
