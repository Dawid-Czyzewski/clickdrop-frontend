'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ANIM_MS = 1600

type SkinUpgradeAnimProps = {
  outcome: 'SUCCESS' | 'FAIL'
  onDone: () => void
}

export function SkinUpgradeAnim({ outcome, onDone }: SkinUpgradeAnimProps) {
  const { t } = useTranslation()
  const landPct = outcome === 'SUCCESS' ? 78 : 22

  useEffect(() => {
    const id = window.setTimeout(onDone, ANIM_MS)
    return () => window.clearTimeout(id)
  }, [onDone])

  return (
    <div
      className="flex w-full max-w-lg flex-col items-center gap-4"
      role="status"
      aria-live="polite"
      aria-label={t('skinUpgrade.animating')}
    >
      <p className="font-display text-sm tracking-wider text-cd-muted uppercase">
        {t('skinUpgrade.animating')}
      </p>
      <div className="relative h-14 w-full overflow-hidden rounded-lg border border-cd-border bg-cd-bg">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-red-500/25" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-emerald-500/25" />
        <span className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 font-display text-xs font-semibold tracking-wider text-red-300 uppercase">
          {t('skinUpgrade.lose')}
        </span>
        <span className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 font-display text-xs font-semibold tracking-wider text-emerald-300 uppercase">
          {t('skinUpgrade.win')}
        </span>
        <div
          className="cd-upgrade-needle absolute top-0 bottom-0 w-1 bg-cd-accent shadow-[0_0_12px_rgba(245,158,11,0.8)]"
          style={{ ['--land-pct' as string]: `${landPct}%` }}
        />
      </div>
    </div>
  )
}
