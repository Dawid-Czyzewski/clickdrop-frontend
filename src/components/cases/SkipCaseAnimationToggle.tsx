'use client'

import { useTranslation } from 'react-i18next'
import { useSkipCaseAnimation } from '../../hooks/useSkipCaseAnimation'

type SkipCaseAnimationToggleProps = {
  disabled?: boolean
}

export function SkipCaseAnimationToggle({
  disabled = false,
}: SkipCaseAnimationToggleProps) {
  const { t } = useTranslation()
  const { skipAnimation, setSkipAnimation } = useSkipCaseAnimation()

  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2.5 px-1 text-sm text-cd-muted">
      <input
        type="checkbox"
        checked={skipAnimation}
        disabled={disabled}
        onChange={(e) => setSkipAnimation(e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-cd-accent disabled:cursor-not-allowed"
      />
      <span>{t('cases.skipAnimation')}</span>
    </label>
  )
}
