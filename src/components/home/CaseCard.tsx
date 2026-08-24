import { useTranslation } from 'react-i18next'
import type { CaseItem } from '../../data/home'
import { CasePlaceholder } from './CasePlaceholder'

type CaseCardProps = {
  item: CaseItem
}

export function CaseCard({ item }: CaseCardProps) {
  const { t } = useTranslation()

  return (
    <article className="group flex flex-col rounded-lg border border-cd-border bg-cd-surface/70 p-3 transition hover:border-cd-accent/50 hover:bg-cd-surface">
      <div className="relative flex aspect-[5/4] items-center justify-center rounded-md bg-cd-bg/60">
        {item.featured ? (
          <span className="absolute top-2 left-2 rounded bg-cd-accent px-1.5 py-0.5 font-display text-[9px] font-bold tracking-wider text-cd-bg uppercase">
            TOP
          </span>
        ) : null}
        <CasePlaceholder accent={item.accent} className="h-[72%] w-[72%] transition duration-300 group-hover:scale-105" />
      </div>
      <h3 className="mt-3 truncate text-center text-sm font-medium text-cd-text">{t(item.nameKey)}</h3>
      <button
        type="button"
        className="mt-2 cursor-pointer rounded-md bg-cd-accent/90 px-3 py-2 text-center font-display text-xs font-semibold tracking-wide text-cd-bg transition hover:bg-cd-accent"
      >
        {item.price}
      </button>
    </article>
  )
}
