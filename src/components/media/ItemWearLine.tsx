'use client'

import { useTranslation } from 'react-i18next'

type ItemWearLineProps = {
  floatValue?: number | null
  paintSeed?: number | null
  className?: string
}

export function ItemWearLine({ floatValue, paintSeed, className }: ItemWearLineProps) {
  const { t } = useTranslation()
  if (floatValue == null || paintSeed == null) return null

  return (
    <p className={['truncate tabular-nums text-cd-muted', className].filter(Boolean).join(' ')}>
      {t('inventory.wearLine', {
        float: floatValue.toFixed(6),
        seed: paintSeed,
      })}
    </p>
  )
}
