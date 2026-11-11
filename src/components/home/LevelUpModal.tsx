'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { useModalA11y } from '../../hooks/useModalA11y'
import { cdBtnPrimary } from '../ui/uiStyles'

type LevelUpModalProps = {
  level: number
  reward?: number
  onClose: () => void
}

export function LevelUpModal({ level, reward = 0, onClose }: LevelUpModalProps) {
  const { t, i18n } = useTranslation()
  const handleClose = useCallback(() => onClose(), [onClose])
  const dialogRef = useModalA11y({ onClose: handleClose })

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overflow-x-clip bg-[#06070a]/95 outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      onClick={handleClose}
    >
      <div
        className="cd-fade-in relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-[max(4rem,env(safe-area-inset-top))] pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4rem))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[min(70vw,22rem)] w-[min(70vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--cd-accent) 45%, transparent) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />

        <p className="relative z-10 font-display text-xs tracking-[0.28em] text-cd-accent uppercase sm:text-sm">
          {t('home.header.levelUpEyebrow')}
        </p>
        <h2
          id="level-up-title"
          className="relative z-10 mt-3 text-center font-display text-4xl font-bold text-cd-text sm:text-5xl"
        >
          {t('home.header.levelUpTitle', { level })}
        </h2>
        {reward > 0 ? (
          <p className="relative z-10 mt-3 font-display text-2xl font-bold tabular-nums text-cd-accent sm:text-3xl">
            {t('home.header.levelUpReward', {
              amount: formatClickDollars(reward, i18n.language),
            })}
          </p>
        ) : null}
        <p className="relative z-10 mt-3 max-w-sm text-center text-sm text-cd-muted sm:text-base">
          {t('home.header.levelUpMessage', { level })}
        </p>
        <p className="relative z-10 mt-2 max-w-sm text-center text-sm text-cd-accent sm:text-base">
          {t('home.header.levelUpCasesUnlocked')}
        </p>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-cd-border/60 bg-[#06070a]/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <button
          type="button"
          onClick={handleClose}
          className={`${cdBtnPrimary} mx-auto flex h-12 w-full max-w-md min-w-[10rem] px-8 text-base`}
        >
          {t('home.header.levelUpContinue')}
        </button>
      </div>
    </div>
  )
}
