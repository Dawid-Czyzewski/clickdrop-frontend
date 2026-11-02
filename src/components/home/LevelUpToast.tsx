'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeLevelUp } from '../../lib/levelUpStore'

type LevelUpToastState = {
  id: number
  level: number
}

export function LevelUpToast() {
  const { t } = useTranslation()
  const [toast, setToast] = useState<LevelUpToastState | null>(null)

  useEffect(() => {
    let nextId = 0
    return subscribeLevelUp((level) => {
      nextId += 1
      setToast({ id: nextId, level })
    })
  }, [])

  if (!toast) return null

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      onAnimationEnd={() => setToast(null)}
      className="cd-level-up-toast cd-toast-fixed pointer-events-none fixed top-20 left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-cd-accent/50 bg-cd-surface/95 px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:top-24 sm:px-5"
    >
      <p className="font-display text-sm font-bold tracking-wide text-cd-accent sm:text-base">
        {t('home.header.levelUp', { level: toast.level })}
      </p>
      <p className="mt-0.5 text-xs text-cd-muted sm:text-sm">
        {t('home.header.levelUpCasesUnlocked')}
      </p>
    </div>
  )
}
