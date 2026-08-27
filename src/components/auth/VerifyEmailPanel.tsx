import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { ApiError } from '../../api/client'
import {
  getPendingVerificationEmail,
  setPendingVerificationEmail,
} from '../../auth/pendingVerification'
import { authSubmitClassName } from './authStyles'

type VerifyEmailLocationState = {
  email?: string
}

function resolveEmail(state: VerifyEmailLocationState | null): string {
  const fromState = state?.email?.trim()
  if (fromState) {
    setPendingVerificationEmail(fromState)
    return fromState
  }
  return getPendingVerificationEmail() ?? ''
}

export function VerifyEmailPanel() {
  const { t } = useTranslation()
  const location = useLocation()
  const [email] = useState(() =>
    resolveEmail(location.state as VerifyEmailLocationState | null),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  if (!email) {
    return <Navigate to="/register" replace />
  }

  async function handleResend() {
    if (isSubmitting) {
      return
    }

    setError('')
    setResent(false)
    setIsSubmitting(true)

    try {
      await authApi.resendVerification({ email })
      setResent(true)
    } catch (err) {
      setError(
        err instanceof ApiError ? t('verifyEmail.error') : t('verifyEmail.networkError'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-base text-cd-muted">{t('verifyEmail.message')}</p>
        <p className="break-all text-base font-medium text-cd-text">{email}</p>
      </div>

      <div aria-live="polite" className="flex min-h-5 flex-col gap-2">
        {resent ? (
          <p role="status" className="text-sm text-cd-accent">
            {t('verifyEmail.resent')}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-cd-danger">
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        onClick={() => void handleResend()}
        className={authSubmitClassName}
      >
        {isSubmitting ? t('verifyEmail.resending') : t('verifyEmail.resend')}
      </button>

      <p className="text-base text-cd-muted">
        <Link
          to="/login"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('verifyEmail.loginLink')}
        </Link>
      </p>
    </div>
  )
}
