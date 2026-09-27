'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'
import { cdBtnPrimaryBlock, cdEyebrow } from '../ui/uiStyles'

type DailyCashResultModalProps = {
  cashAmount: number
  onClose: () => void
}

export function DailyCashResultModal({ cashAmount, onClose }: DailyCashResultModalProps) {
  const { t, i18n } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-cash-title"
    >
      <div className="cd-fade-in w-full max-w-md overflow-hidden rounded-xl border border-cd-border bg-cd-surface shadow-2xl">
        <div className="h-1 w-full bg-cd-accent" />
        <div className="p-6 text-center sm:p-8">
          <p className={cdEyebrow}>{t('daily.cashLabel')}</p>
          <h2 id="daily-cash-title" className="mt-2 font-display text-2xl font-bold text-cd-text">
            {t('daily.cashWin', {
              amount: formatClickDollars(cashAmount, i18n.language),
            })}
          </h2>
          <div
            className="mx-auto mt-6 flex h-32 w-44 items-center justify-center rounded-lg border border-cd-border"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.3), transparent 70%)',
            }}
            aria-hidden="true"
          >
            <span className="font-display text-4xl font-bold text-cd-accent">$</span>
          </div>
          <button type="button" onClick={onClose} className={`${cdBtnPrimaryBlock} mt-5`}>
            {t('daily.cashOk')}
          </button>
        </div>
      </div>
    </div>
  )
}
