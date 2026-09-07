'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { STATS } from '../../data/home'

const NAV_LINKS = [
  { href: '/', key: 'cases' as const },
  { href: '/upgrades', key: 'upgrades' as const },
]

export function NavStatsBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <div className="border-b border-cd-border bg-cd-surface/60">
      <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-3 py-0 sm:px-5 lg:px-8">
        <nav className="flex shrink-0 items-stretch gap-1" aria-label={t('home.nav.label')}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'cursor-pointer shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium tracking-wide uppercase no-underline transition',
                  active
                    ? 'border-emerald-400 text-cd-text'
                    : 'border-transparent text-cd-muted hover:text-cd-text',
                ].join(' ')}
              >
                {t(`home.nav.${link.key}`)}
              </Link>
            )
          })}
        </nav>

        <ul className="m-0 flex min-w-0 flex-1 list-none items-center gap-6 overflow-x-auto py-2.5">
          {STATS.map((stat) => (
            <li key={stat.id} className="flex shrink-0 items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-cd-accent/15 text-xs text-cd-accent">
                ◆
              </span>
              <span className="font-semibold text-cd-text tabular-nums">{stat.value}</span>
              <span className="text-cd-muted">{t(stat.labelKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
