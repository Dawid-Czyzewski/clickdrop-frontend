'use client'

import { useTranslation } from 'react-i18next'
import { cdBtnPrimary } from '../ui/uiStyles'

type LevelUpModalProps = {
  level: number
  onClose: () => void
}

export function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-[#06070a]/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      onClick={onClose}
    >
      <div
        className="cd-fade-in relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[min(70vw,22rem)] w-[min(70vw,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--cd-accent) 45%, transparent) 0%, transparent 68%)',
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
        <p className="relative z-10 mt-3 max-w-sm text-center text-sm text-cd-muted sm:text-base">
          {t('home.header.levelUpMessage', { level })}
        </p>
        <p className="relative z-10 mt-2 max-w-sm text-center text-sm text-cd-accent sm:text-base">
          {t('home.header.levelUpCasesUnlocked')}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`${cdBtnPrimary} relative z-10 mt-8 h-12 min-w-[10rem] px-8 text-base`}
        >
          {t('home.header.levelUpContinue')}
        </button>
      </div>
    </div>
  )
}
