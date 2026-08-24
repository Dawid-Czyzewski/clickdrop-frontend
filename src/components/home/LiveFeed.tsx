import { useTranslation } from 'react-i18next'
import { LIVE_DROPS, RARITY_COLOR } from '../../data/home'
import { DropPlaceholder } from './DropPlaceholder'

export function LiveFeed() {
  const { t } = useTranslation()

  return (
    <aside
      className="hidden w-[112px] shrink-0 flex-col border-r border-cd-border bg-cd-bg-elevated/80 xl:flex"
      aria-label={t('home.feed.label')}
    >
      <p className="border-b border-cd-border px-2 py-2 text-center text-[10px] font-medium tracking-wider text-cd-muted uppercase">
        {t('home.feed.title')}
      </p>
      <ul className="m-0 flex list-none flex-col gap-1 overflow-y-auto p-1.5" style={{ maxHeight: 'calc(100svh - 11rem)' }}>
        {LIVE_DROPS.map((drop) => {
          const color = RARITY_COLOR[drop.rarity]
          return (
            <li
              key={drop.id}
              className="rounded border border-cd-border/80 bg-cd-surface/80 p-1.5 transition hover:border-cd-accent/40"
              style={{ boxShadow: `inset 0 -2px 0 ${color}` }}
            >
              <DropPlaceholder color={color} className="mx-auto h-8 w-full" />
              <p className="mt-1 truncate text-center text-[10px] leading-tight text-cd-text">{drop.name}</p>
              <p className="text-center text-[9px] text-cd-muted">{drop.wear}</p>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
