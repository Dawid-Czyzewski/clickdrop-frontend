'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import { shouldSkipCaseSpin } from '../../lib/caseAnimationPreference'
import {
  MULTI_SPIN_DURATION_MS,
  MULTI_SPIN_ITEM_WIDTH,
  MULTI_SPIN_STAGGER_MS,
} from '../../lib/caseSpin'
import { CaseOpenSpinReel } from './CaseOpenSpinReel'

type CaseOpenMultiSpinnerProps = {
  drops: CaseDrop[]
  winners: string[]
  onComplete: () => void
}

export function CaseOpenMultiSpinner({
  drops,
  winners,
  onComplete,
}: CaseOpenMultiSpinnerProps) {
  const { t } = useTranslation()
  const doneRef = useRef(false)

  useEffect(() => {
    function finish() {
      if (doneRef.current) return
      doneRef.current = true
      onComplete()
    }

    if (shouldSkipCaseSpin() || winners.length === 0) {
      finish()
      return
    }

    const totalMs =
      MULTI_SPIN_DURATION_MS +
      Math.max(0, winners.length - 1) * MULTI_SPIN_STAGGER_MS +
      120
    const timer = window.setTimeout(finish, totalMs)
    return () => window.clearTimeout(timer)
  }, [onComplete, winners.length])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-multi-spin-title"
      aria-busy="true"
    >
      <div className="flex w-full max-w-5xl flex-col gap-2.5 py-4 sm:gap-3">
        <p
          id="case-multi-spin-title"
          className="text-center font-display text-sm tracking-[0.2em] text-cd-accent uppercase sm:text-base"
        >
          {t('cases.openCount.spinning', { count: winners.length })}
        </p>
        {winners.map((code, index) => (
          <CaseOpenSpinReel
            key={`${code}-${index}`}
            drops={drops}
            winnerCode={code}
            delayMs={index * MULTI_SPIN_STAGGER_MS}
            itemWidth={MULTI_SPIN_ITEM_WIDTH}
            durationMs={MULTI_SPIN_DURATION_MS}
            compact
          />
        ))}
      </div>
    </div>
  )
}
