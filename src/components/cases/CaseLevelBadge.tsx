'use client'

import { useTranslation } from 'react-i18next'

type CaseLevelBadgeProps = {
  minLevel: number
  locked?: boolean
  className?: string
  labelKey?: string
}

export function CaseLevelBadge({
  minLevel,
  locked = false,
  className = '',
  labelKey = 'cases.minLevelBadge',
}: CaseLevelBadgeProps) {
  const { t } = useTranslation()

  return (
    <span
      className={[
        'inline-flex items-center rounded border px-1.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-wider uppercase',
        locked
          ? 'border-cd-danger/50 bg-cd-danger/15 text-cd-danger'
          : 'border-cd-border bg-cd-bg/80 text-cd-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {t(labelKey, { level: minLevel })}
    </span>
  )
}
