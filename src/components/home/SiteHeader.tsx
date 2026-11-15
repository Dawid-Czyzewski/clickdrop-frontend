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
  const isPl = i18n.language.startsWith('pl')

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  function handleLogout() {
    void performSessionLogout((path) => {
      setLoggedIn(false)
      router.push(path)
    })
  }

  const langBtn = (active: boolean) =>
    [
      'inline-flex min-h-11 min-w-9 cursor-pointer items-center justify-center rounded-md text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent sm:min-w-11',
      active ? 'bg-cd-accent text-cd-bg' : 'text-cd-muted hover:text-cd-text',
    ].join(' ')

  const iconBtn =
    'inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-cd-border bg-cd-surface text-cd-text no-underline transition hover:bg-cd-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent sm:w-auto sm:gap-2 sm:px-3'

  return (
    <header className="sticky top-0 z-40 overflow-x-clip border-b border-cd-border bg-cd-bg-elevated/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
      <div className="flex h-14 w-full min-w-0 items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5 lg:px-8">
        <Link
          href="/"
          aria-label="ClickDrop"
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <svg viewBox="0 0 64 64" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true">
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
          <span className="hidden font-display text-base font-semibold tracking-[0.14em] text-cd-text sm:inline">
            CLICK<span className="text-cd-accent">DROP</span>
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label={t('language.label')}
            onClick={() => void setAppLanguage(isPl ? 'en' : 'pl')}
            className={`${langBtn(true)} sm:hidden`}
          >
            {isPl ? 'PL' : 'EN'}
          </button>
          <div className="hidden shrink-0 sm:flex" role="group" aria-label={t('language.label')}>
            <button
              type="button"
              onClick={() => void setAppLanguage('pl')}
              className={langBtn(isPl)}
            >
              PL
            </button>
            <button
              type="button"
              onClick={() => void setAppLanguage('en')}
              className={langBtn(!isPl)}
            >
              EN
            </button>
          </div>

          {loggedIn ? (
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 overflow-hidden">
                <HeaderUserStatsPanel />
              </div>
              <div className="hidden sm:contents">
                <Link
                  href="/settings"
                  aria-label={t('home.header.settings')}
                  className={iconBtn}
                >
                  <span className="text-sm font-medium">{t('home.header.settings')}</span>
                </Link>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label={t('home.header.logout')}
                className={iconBtn}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 sm:hidden"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M10 7V5.8A1.8 1.8 0 0 1 11.8 4h6.4A1.8 1.8 0 0 1 20 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8h-6.4A1.8 1.8 0 0 1 10 18.2V17" />
                  <path d="M4 12h10M7 9l-3 3 3 3" />
                </svg>
                <span className="hidden text-sm font-medium sm:inline">
                  {t('home.header.logout')}
                </span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-cd-accent px-3.5 font-display text-xs font-semibold text-cd-bg uppercase no-underline transition hover:bg-cd-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent sm:px-5 sm:text-sm"
            >
              {t('home.header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
