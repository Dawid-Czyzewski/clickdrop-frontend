'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { subscribeLevelUp } from '../../lib/levelUpStore'

type LevelUpToastState = {
  id: number
  level: number
  reward: number
}

export function LevelUpToast() {
  const { t, i18n } = useTranslation()
  const [toast, setToast] = useState<LevelUpToastState | null>(null)

  useEffect(() => {
    let nextId = 0
    return subscribeLevelUp(({ level, reward }) => {
      nextId += 1
      setToast({ id: nextId, level, reward })
    })
  }, [])

  if (!toast) return null

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      onAnimationEnd={() => setToast(null)}
      className="cd-level-up-toast cd-toast-fixed pointer-events-none fixed left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-cd-accent/50 bg-cd-surface/95 px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:px-5"
    >
      <p className="font-display text-sm font-bold tracking-wide text-cd-accent sm:text-base">
        {t('home.header.levelUp', { level: toast.level })}
      </p>
      {toast.reward > 0 ? (
        <p className="mt-0.5 font-display text-sm font-semibold tabular-nums text-cd-text sm:text-base">
          {t('home.header.levelUpReward', {
            amount: formatClickDollars(toast.reward, i18n.language),
          })}
        </p>
      ) : null}
      <p className="mt-0.5 text-xs text-cd-muted sm:text-sm">
        {t('home.header.levelUpCasesUnlocked')}
      </p>
    </div>
  )
}
