import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const GAMES = ['cs2', 'dota', 'rust'] as const

export function GameSwitcher() {
  const { t } = useTranslation()
  const [active, setActive] = useState<(typeof GAMES)[number]>('cs2')

  return (
    <div className="flex gap-1" role="tablist" aria-label={t('home.games.label')}>
      {GAMES.map((game) => (
        <button
          key={game}
          type="button"
          role="tab"
          aria-selected={active === game}
          onClick={() => setActive(game)}
          className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition ${
            active === game
              ? 'bg-cd-surface text-cd-text ring-1 ring-cd-border'
              : 'text-cd-muted hover:text-cd-text'
          }`}
        >
          {t(`home.games.${game}`)}
        </button>
      ))}
    </div>
  )
}
