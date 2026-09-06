'use client'

import { useTranslation } from 'react-i18next'

export type EarnToast = {
  id: number
  amount: number
  drift: number
}

type EarnedFeedbackProps = {
  toasts: EarnToast[]
  onDismiss: (id: number) => void
}

export function EarnedFeedback({ toasts, onDismiss }: EarnedFeedbackProps) {
  const { t } = useTranslation()
  const latest = toasts[toasts.length - 1]

  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute top-1/2 left-[calc(50%+5.75rem)] z-30 h-0 w-32 -translate-y-1/2 sm:left-[calc(50%+7rem)] sm:w-40"
      aria-live="polite"
    >
      {latest ? (
        <span className="sr-only" role="status">
          {t('home.earn.earned', { count: latest.amount })}
        </span>
      ) : null}

      {toasts.map((toast) => (
        <p
          key={toast.id}
          aria-hidden="true"
          onAnimationEnd={() => onDismiss(toast.id)}
          className="cd-earned-float absolute left-0 whitespace-nowrap font-display text-base font-bold tracking-wide text-[#7dffa0] drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)] sm:text-lg"
          style={{ top: `${toast.drift}px` }}
        >
          {t('home.earn.earned', { count: toast.amount })}
        </p>
      ))}
    </div>
  )
}
