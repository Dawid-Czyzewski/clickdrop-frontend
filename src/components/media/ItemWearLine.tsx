'use client'

import { useTranslation } from 'react-i18next'

type ItemWearLineProps = {
  floatValue?: number | null
  paintSeed?: number | null
  className?: string
  layout?: 'inline' | 'stack'
}

export function ItemWearLine({
  floatValue,
  paintSeed,
  className,
  layout = 'inline',
}: ItemWearLineProps) {
  const { t } = useTranslation()
  if (floatValue == null || paintSeed == null) return null

  const floatText = floatValue.toFixed(6)

  if (layout === 'stack') {
    return (
      <dl
        className={['grid grid-cols-2 gap-x-4 gap-y-1 tabular-nums', className]
          .filter(Boolean)
          .join(' ')}
      >
        <div>
          <dt className="text-[0.65rem] tracking-wide text-cd-muted uppercase">
            {t('inventory.float')}
          </dt>
          <dd className="font-display text-sm text-cd-text">{floatText}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-wide text-cd-muted uppercase">
            {t('inventory.pattern')}
          </dt>
          <dd className="font-display text-sm text-cd-text">{paintSeed}</dd>
        </div>
      </dl>
    )
  }

  return (
    <p className={['truncate tabular-nums text-cd-muted', className].filter(Boolean).join(' ')}>
      {t('inventory.wearLine', { float: floatText, seed: paintSeed })}
    </p>
  )
}
