'use client'

import { useTranslation } from 'react-i18next'

type StatTrackBadgeProps = {
  className?: string
}

export function StatTrackBadge({ className = '' }: StatTrackBadgeProps) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded border border-cd-accent/80 bg-cd-bg/90 px-1.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-wide text-cd-accent uppercase shadow-sm backdrop-blur-sm ${className}`}
    >
      {t('items.statTrack')}
    </span>
  )
}
