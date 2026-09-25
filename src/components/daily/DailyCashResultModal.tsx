'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'

type DailyCashResultModalProps = {
  cashAmount: number
  balance: number
  onClose: () => void
}

export function DailyCashResultModal({
  cashAmount,
  balance,
  onClose,
}: DailyCashResultModalProps) {
  const { t, i18n } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-cash-title"
    >
      <div className="w-full max-w-md rounded-lg border border-cd-accent/50 bg-cd-surface p-6 text-center shadow-xl">
        <p className="font-display text-xs tracking-[0.2em] text-cd-accent uppercase">
          {t('daily.cashLabel')}
        </p>
        <h2 id="daily-cash-title" className="mt-2 font-display text-2xl font-bold text-cd-text">
          {t('daily.cashWin', {
            amount: formatClickDollars(cashAmount, i18n.language),
          })}
        </h2>
        <div
          className="mx-auto mt-5 flex h-28 w-40 items-center justify-center rounded-md border border-cd-accent"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.35), transparent 70%)',
          }}
          aria-hidden="true"
        >
          <span className="font-display text-4xl font-bold text-cd-accent">$</span>
        </div>
        <p className="mt-4 text-sm text-cd-muted">
          {t('daily.cashBalance', {
            amount: formatClickDollars(balance, i18n.language),
          })}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full cursor-pointer rounded-md bg-cd-accent px-4 py-2.5 font-display text-sm font-semibold tracking-wider text-cd-bg uppercase transition hover:bg-cd-accent-hover"
        >
          {t('daily.cashOk')}
        </button>
      </div>
    </div>
  )
}
