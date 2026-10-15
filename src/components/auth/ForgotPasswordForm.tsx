'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { resolveForgotPasswordError } from '../../auth/resolvePasswordResetError'
import { AuthResultPanel } from './AuthResultPanel'
import { authInputClassName, authSubmitClassName } from './authStyles'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await authApi.forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(resolveForgotPasswordError(err, t))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return <AuthResultPanel message={t('forgotPassword.success')} tone="success" />
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <p className="text-sm text-cd-muted">{t('forgotPassword.subtitle')}</p>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="forgot-email"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('forgotPassword.email')}
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClassName}
          placeholder={t('forgotPassword.emailPlaceholder')}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
      </button>

      <p className="text-center text-base text-cd-muted">
        <Link
          href="/login"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('forgotPassword.loginLink')}
        </Link>
      </p>
    </form>
  )
}
