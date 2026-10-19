'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { authService } from '../../auth/authService'
import { resolveLogoutAllError } from '../../auth/resolveLogoutAllError'
import { cdBodyMuted, cdSectionLabel } from '../ui/uiStyles'
import { LogoutAllConfirmModal } from './LogoutAllConfirmModal'

export function LogoutAllSection() {
  const { t } = useTranslation()
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setError('')
    setIsSubmitting(true)

    try {
      await authApi.logoutAll()
      authService.logout()
      router.replace('/login')
    } catch (err) {
      setError(resolveLogoutAllError(err, t))
      setIsSubmitting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="logout-all-heading">
      <div>
        <h2 id="logout-all-heading" className={cdSectionLabel}>
          {t('settings.logoutAll.heading')}
        </h2>
        <p className={`mt-1 ${cdBodyMuted}`}>{t('settings.logoutAll.subtitle')}</p>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setError('')
          setConfirmOpen(true)
        }}
        className="inline-flex h-11 w-full max-w-md cursor-pointer items-center justify-center rounded-md border border-cd-danger bg-cd-danger/10 px-5 font-display text-sm font-semibold tracking-wider text-cd-danger uppercase transition hover:bg-cd-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('settings.logoutAll.cta')}
      </button>

      {confirmOpen ? (
        <LogoutAllConfirmModal
          isSubmitting={isSubmitting}
          onCancel={() => {
            if (!isSubmitting) setConfirmOpen(false)
          }}
          onConfirm={() => {
            void handleConfirm()
          }}
        />
      ) : null}
    </section>
  )
}
