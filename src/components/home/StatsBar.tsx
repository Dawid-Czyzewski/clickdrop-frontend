import { useTranslation } from 'react-i18next'
import { STATS } from '../../data/home'

export function StatsBar() {
  const { t } = useTranslation()

  return (
    <div className="border-b border-cd-border bg-cd-surface/60">
      <ul className="m-0 flex w-full list-none items-center gap-6 overflow-x-auto px-3 py-2.5 sm:px-5 lg:px-8">
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
  )
}
