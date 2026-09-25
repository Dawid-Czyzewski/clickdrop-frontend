'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const NAV_LINKS = [
  { href: '/upgrades', key: 'upgrades' as const },
  { href: '/inventory', key: 'inventory' as const },
  { href: '/daily', key: 'daily' as const },
]

export function NavStatsBar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <div className="border-b border-cd-border bg-cd-surface/60">
      <div className="flex w-full items-center px-3 sm:px-5 lg:px-8">
        <nav className="relative z-10 flex shrink-0 items-stretch gap-1" aria-label={t('home.nav.label')}>
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
      </div>
    </div>
  )
}
