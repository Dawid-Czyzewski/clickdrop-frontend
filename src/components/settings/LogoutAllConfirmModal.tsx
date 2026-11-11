'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalA11y } from '../../hooks/useModalA11y'
import { cdBtnGhost } from '../ui/uiStyles'

type LogoutAllConfirmModalProps = {
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutAllConfirmModal({
  isSubmitting,
  onConfirm,
  onCancel,
}: LogoutAllConfirmModalProps) {
  const { t } = useTranslation()
  const handleCancel = useCallback(() => {
    if (!isSubmitting) onCancel()
  }, [isSubmitting, onCancel])
  const dialogRef = useModalA11y({ onClose: handleCancel })

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/70 px-3 py-4 outline-none sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-all-confirm-title"
      onClick={handleCancel}
    >
      <div
        className="mb-[env(safe-area-inset-bottom,0px)] w-full max-w-md rounded-xl border border-cd-border bg-cd-surface p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="logout-all-confirm-title"
          className="font-display text-lg font-semibold text-cd-text"
        >
          {t('settings.logoutAll.confirmTitle')}
        </h2>
        <p className="mt-2 text-sm text-cd-muted">{t('settings.logoutAll.confirmBody')}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCancel}
            className={`${cdBtnGhost} min-h-11 px-4`}
          >
            {t('settings.logoutAll.confirmCancel')}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            onClick={onConfirm}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-cd-danger bg-cd-danger/15 px-4 font-display text-sm font-semibold tracking-wider text-cd-danger uppercase transition hover:bg-cd-danger/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? t('settings.logoutAll.submitting')
              : t('settings.logoutAll.confirmCta')}
          </button>
        </div>
      </div>
    </div>
  )
}
