'use client'

import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { resolveChangePasswordError } from '../../auth/resolveChangePasswordError'
import { authInputClassName, authSubmitClassName } from '../auth/authStyles'

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError(t('settings.changePassword.passwordMismatch'))
      return
    }

    if (newPassword === currentPassword) {
      setError(t('settings.changePassword.samePassword'))
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
    } catch (err) {
      setError(resolveChangePasswordError(err, t))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="settings-current-password"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('settings.changePassword.current')}
        </label>
        <input
          id="settings-current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('settings.changePassword.currentPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="settings-new-password"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('settings.changePassword.new')}
        </label>
        <input
          id="settings-new-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('settings.changePassword.newPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="settings-confirm-password"
          className="text-sm font-medium tracking-wider text-cd-muted uppercase"
        >
          {t('settings.changePassword.confirm')}
        </label>
        <input
          id="settings-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('settings.changePassword.confirmPlaceholder')}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      {success ? (
        <p role="status" className="text-sm text-cd-accent">
          {t('settings.changePassword.success')}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting
          ? t('settings.changePassword.submitting')
          : t('settings.changePassword.submit')}
      </button>
    </form>
  )
}
