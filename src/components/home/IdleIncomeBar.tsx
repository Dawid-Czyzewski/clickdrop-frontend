'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { cdBtnGhost, cdBtnPrimary } from '../ui/uiStyles'

type IdleIncomeBarProps = {
  pending: number
  isCollecting: boolean
  collectDisabled?: boolean
  onCollect: () => void
}

export function IdleIncomeBar({
  pending,
  isCollecting,
  collectDisabled = false,
  onCollect,
}: IdleIncomeBarProps) {
  const { t, i18n } = useTranslation()
  const amount = formatClickDollars(pending, i18n.language)
  const canCollect = pending > 0

  return (
    <div className="flex w-full max-w-sm flex-wrap items-center justify-between gap-3 rounded-lg border border-cd-border bg-cd-bg/55 px-3 py-2.5">
      <p className="text-sm tabular-nums text-cd-text">
        {t('home.earn.pendingIdle', { amount })}
      </p>
      <button
        type="button"
        disabled={collectDisabled || isCollecting || !canCollect}
        aria-busy={isCollecting || undefined}
        onClick={onCollect}
        className={`${canCollect ? cdBtnPrimary : cdBtnGhost} h-9 px-4 text-xs`}
      >
        {isCollecting ? t('home.earn.collecting') : t('home.earn.collect')}
      </button>
    </div>
  )
}
