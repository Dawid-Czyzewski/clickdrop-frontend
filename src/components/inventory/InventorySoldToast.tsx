'use client'

import { useTranslation } from 'react-i18next'
import { formatClickDollars } from '../../lib/formatClickDollars'

type InventorySoldToastProps = {
  amount: number
  toastKey: number
  onDismiss: () => void
}

export function InventorySoldToast({ amount, toastKey, onDismiss }: InventorySoldToastProps) {
  const { t, i18n } = useTranslation()

  return (
    <div
      key={toastKey}
      role="status"
      aria-live="polite"
      onAnimationEnd={onDismiss}
      className="cd-level-up-toast cd-toast-fixed pointer-events-none fixed left-1/2 z-[60] -translate-x-1/2 rounded-lg border border-cd-accent/50 bg-cd-surface/95 px-4 py-3 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:px-5"
    >
      <p className="font-display text-sm font-bold tracking-wide text-cd-accent sm:text-base">
        {t('inventory.batchSold', {
          amount: formatClickDollars(amount, i18n.language),
        })}
      </p>
    </div>
  )
}
