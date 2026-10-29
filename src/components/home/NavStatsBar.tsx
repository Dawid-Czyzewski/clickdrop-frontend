'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { href: '/#cases', key: 'cases' as const, match: '/' },
  { href: '/cases/opens', key: 'caseOpens' as const, match: '/cases/opens' },
  { href: '/upgrades', key: 'upgrades' as const, match: '/upgrades' },
  { href: '/skin-upgrade', key: 'skinUpgrade' as const, match: '/skin-upgrade' },
  { href: '/inventory', key: 'inventory' as const, match: '/inventory' },
  { href: '/daily', key: 'daily' as const, match: '/daily' },
  { href: '/leaderboard', key: 'leaderboard' as const, match: '/leaderboard' },
  { href: '/settings', key: 'settings' as const, match: '/settings' },
]

export function NavStatsBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <div className="border-b border-cd-border bg-cd-bg-elevated/50">
      <div className="flex w-full items-center overflow-x-auto px-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-5 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <nav
          className="relative z-10 flex shrink-0 items-center gap-1 py-1.5"
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
                  'cursor-pointer shrink-0 px-3.5 py-2 text-sm font-medium tracking-wide uppercase no-underline transition',
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
