'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { resolveResetPasswordError } from '../../auth/resolvePasswordResetError'
import { authInputClassName, authSubmitClassName } from './authStyles'

type ResetPasswordFormProps = {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'))
      return
    }

    if (!token) {
      setError(t('resetPassword.missingToken'))
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.resetPassword({ token, newPassword: password })
      router.replace('/login')
    } catch (err) {
      setError(resolveResetPasswordError(err, t))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <p className="text-sm text-cd-muted">{t('resetPassword.subtitle')}</p>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="reset-password"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('resetPassword.password')}
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('resetPassword.passwordPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="reset-confirm-password"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('resetPassword.confirmPassword')}
        </label>
        <input
          id="reset-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('resetPassword.confirmPasswordPlaceholder')}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting || !token} className={authSubmitClassName}>
        {isSubmitting ? t('resetPassword.submitting') : t('resetPassword.submit')}
      </button>

      <p className="text-center text-base text-cd-muted">
        <Link
          href="/login"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('resetPassword.loginLink')}
        </Link>
      </p>
    </form>
  )
}
