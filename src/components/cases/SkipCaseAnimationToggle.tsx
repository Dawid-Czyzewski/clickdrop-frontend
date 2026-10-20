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
    <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-cd-muted">
      <input
        type="checkbox"
        checked={skipAnimation}
        disabled={disabled}
        onChange={(e) => setSkipAnimation(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-cd-accent disabled:cursor-not-allowed"
      />
      <span>{t('cases.skipAnimation')}</span>
    </label>
  )
}
