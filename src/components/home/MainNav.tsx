import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const TABS = ['cases', 'event', 'battles', 'contracts'] as const

export function MainNav() {
  const { t } = useTranslation()
  const [active, setActive] = useState<(typeof TABS)[number]>('cases')

  return (
    <nav
      className="border-b border-cd-border bg-cd-bg"
      aria-label={t('home.nav.label')}
    >
      <div className="flex w-full gap-1 overflow-x-auto px-3 sm:px-5 lg:px-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`cursor-pointer shrink-0 border-b-2 px-4 py-3 text-sm font-medium tracking-wide uppercase transition ${
              active === tab
                ? 'border-emerald-400 text-cd-text'
                : 'border-transparent text-cd-muted hover:text-cd-text'
            }`}
          >
            {t(`home.nav.${tab}`)}
          </button>
        ))}
      </div>
    </nav>
  )
}
