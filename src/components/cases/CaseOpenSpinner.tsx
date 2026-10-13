'use client'

import { useTranslation } from 'react-i18next'
import type { CaseDrop } from '../../api/casesApi'
import { CaseOpenSpinReel } from './CaseOpenSpinReel'

type CaseOpenSpinnerProps = {
  drops: CaseDrop[]
  winnerCode: string
  onComplete: () => void
}

export function CaseOpenSpinner({ drops, winnerCode, onComplete }: CaseOpenSpinnerProps) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-spin-title"
      aria-busy="true"
    >
      <div className="w-full max-w-6xl">
        <p
          id="case-spin-title"
          className="mb-5 text-center font-display text-sm tracking-[0.2em] text-cd-accent uppercase sm:text-base"
        >
          {t('cases.spinning')}
        </p>
        <CaseOpenSpinReel drops={drops} winnerCode={winnerCode} onComplete={onComplete} />
      </div>
    </div>
  )
}
