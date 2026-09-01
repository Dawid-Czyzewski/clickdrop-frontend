import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import { HeaderUserStatsPanel } from './HeaderUserStatsPanel'

export function SiteHeader() {
  const { t, i18n } = useTranslation()
  const [, setAuthTick] = useState(0)
  const loggedIn = authService.hasActiveSession()
  const user = authService.getAuthUser()

  function handleLogout() {
    authService.logout()
    setAuthTick((value) => value + 1)
  }

  return (
    <header className="border-b border-cd-border bg-cd-bg-elevated/95 backdrop-blur-sm">
      <div className="flex h-14 w-full items-center gap-4 px-3 sm:h-16 sm:px-5 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 no-underline">
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

        <nav className="ml-2 hidden items-center gap-4 text-sm text-cd-muted lg:flex" aria-label={t('home.header.links')}>
          <span className="cursor-default transition hover:text-cd-text">{t('home.header.blog')}</span>
          <span className="cursor-default transition hover:text-cd-text">{t('home.header.daily')}</span>
          <span className="cursor-default transition hover:text-cd-text">{t('home.header.shop')}</span>
          <span className="inline-flex items-center gap-1.5 text-cd-text">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
            1 284 {t('home.header.online')}
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1" role="group" aria-label={t('language.label')}>
            <button
              type="button"
              onClick={() => void i18n.changeLanguage('pl')}
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
              onClick={() => void i18n.changeLanguage('en')}
              className={`cursor-pointer rounded px-2 py-1 text-xs font-medium transition ${
                i18n.language.startsWith('en')
                  ? 'bg-cd-accent text-cd-bg'
                  : 'text-cd-muted hover:text-cd-text'
              }`}
            >
              EN
            </button>
          </div>

          {loggedIn && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <HeaderUserStatsPanel />
              <span className="hidden max-w-[140px] truncate text-sm text-cd-text lg:inline">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-md border border-cd-border bg-cd-surface px-3 py-1.5 text-sm font-medium text-cd-text transition hover:bg-cd-surface-hover"
              >
                {t('home.header.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
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
