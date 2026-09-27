'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ANIM_MS = 1600

type SkinUpgradeAnimProps = {
  winPct: number
  mode: 'idle' | 'spinning'
  outcome?: 'SUCCESS' | 'FAIL'
  onDone?: () => void
}

export function SkinUpgradeAnim({ winPct, mode, outcome, onDone }: SkinUpgradeAnimProps) {
  const { t } = useTranslation()
  const clamped = Math.min(99, Math.max(1, winPct))
  const losePct = 100 - clamped
  const landPct =
    outcome === 'SUCCESS'
      ? losePct + clamped * 0.65
      : outcome === 'FAIL'
        ? losePct * 0.35
        : 50

  useEffect(() => {
    if (mode !== 'spinning' || !onDone) return
    const id = window.setTimeout(onDone, ANIM_MS)
    return () => window.clearTimeout(id)
  }, [mode, onDone])

  return (
    <div
      className="flex w-full max-w-2xl flex-col items-center gap-3"
      role="status"
      aria-live="polite"
      aria-label={mode === 'spinning' ? t('skinUpgrade.animating') : t('skinUpgrade.riskMeter')}
    >
      {mode === 'spinning' ? (
        <p className="font-display text-sm tracking-wider text-cd-muted uppercase">
          {t('skinUpgrade.animating')}
        </p>
      ) : null}
      <div className="relative h-14 w-full overflow-hidden rounded-lg border border-cd-border bg-cd-bg">
        <div className="absolute inset-y-0 left-0 bg-red-500/25" style={{ width: `${losePct}%` }} />
        <div className="absolute inset-y-0 right-0 bg-emerald-500/25" style={{ width: `${clamped}%` }} />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[0.65rem] font-semibold tracking-wider text-red-300 uppercase"
          style={{ left: `${losePct / 2}%` }}
        >
          {t('skinUpgrade.lose')}
        </span>
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[0.65rem] font-semibold tracking-wider text-emerald-300 uppercase"
          style={{ left: `${losePct + clamped / 2}%` }}
        >
          {t('skinUpgrade.win')}
        </span>
        <div
          className={`absolute top-0 bottom-0 w-1 bg-cd-accent shadow-[0_0_12px_rgba(245,158,11,0.8)] ${
            mode === 'spinning' ? 'cd-upgrade-needle' : ''
          }`}
          style={{
            left: mode === 'idle' ? '50%' : undefined,
            ['--land-pct' as string]: `${landPct}%`,
            ...(mode === 'idle' ? { transform: 'translateX(-50%)' } : {}),
          }}
        />
      </div>
    </div>
  )
}
