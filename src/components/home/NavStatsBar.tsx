'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { href: '/#cases', key: 'cases' as const, match: '/' },
  { href: '/cases/opens', key: 'caseOpens' as const, match: '/cases/opens' },
  { href: '/upgrades', key: 'upgrades' as const, match: '/upgrades' },
  { href: '/skin-upgrade', key: 'skinUpgrade' as const, match: '/skin-upgrade' },
  { href: '/trade-up', key: 'tradeUp' as const, match: '/trade-up' },
  { href: '/inventory', key: 'inventory' as const, match: '/inventory' },
  { href: '/daily', key: 'daily' as const, match: '/daily' },
  { href: '/leaderboard', key: 'leaderboard' as const, match: '/leaderboard' },
  { href: '/settings', key: 'settings' as const, match: '/settings' },
]

export function NavStatsBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <div className="overflow-x-clip border-b border-cd-border bg-cd-bg-elevated/50">
      <div className="w-full min-w-0 px-1.5 sm:px-5 lg:px-8">
        <nav
          className="relative z-10 flex flex-wrap items-center gap-x-0.5 gap-y-0.5 py-1"
          aria-label={t('home.nav.label')}
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.match
            const isCases = link.key === 'cases'
            return (
              <Link
                key={link.key}
                href={link.href}
                className={[
                  'inline-flex min-h-11 cursor-pointer items-center px-2 text-[0.7rem] font-medium uppercase no-underline transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent sm:px-3.5 sm:text-sm sm:tracking-wide',
                  isCases
                    ? active
                      ? 'rounded-md bg-cd-accent font-semibold text-cd-bg'
                      : 'rounded-md text-cd-muted hover:bg-cd-surface hover:text-cd-text'
                    : active
                      ? 'border-b-2 border-cd-accent text-cd-text'
                      : 'border-b-2 border-transparent text-cd-muted hover:text-cd-text',
                ].join(' ')}
              >
                {t(`home.nav.${link.key}`)}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
