import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { ApiError } from '../../api/client'
import { setPendingVerificationEmail } from '../../auth/pendingVerification'
import { authInputClassName, authSubmitClassName } from './authStyles'

export function RegisterForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.register({ email, username, password })
      setPendingVerificationEmail(email)
      navigate('/verify-email', { replace: true, state: { email } })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          const message = err.message.toLowerCase()
          if (message.includes('email')) {
            setError(t('register.emailTaken'))
          } else if (message.includes('username')) {
            setError(t('register.usernameTaken'))
          } else {
            setError(t('register.conflict'))
          }
        } else if (err.status === 400) {
          setError(t('register.validationError'))
        } else {
          setError(t('register.error'))
        }
      } else {
        setError(t('register.networkError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="register-username" className="text-sm font-medium uppercase tracking-wider text-cd-muted">
          {t('register.username')}
        </label>
        <input
          id="register-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={authInputClassName}
          placeholder={t('register.usernamePlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="register-email" className="text-sm font-medium uppercase tracking-wider text-cd-muted">
          {t('register.email')}
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClassName}
          placeholder={t('register.emailPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="register-password" className="text-sm font-medium uppercase tracking-wider text-cd-muted">
          {t('register.password')}
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('register.passwordPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label
          htmlFor="register-confirm-password"
          className="text-sm font-medium uppercase tracking-wider text-cd-muted"
        >
          {t('register.confirmPassword')}
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={100}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('register.confirmPasswordPlaceholder')}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting ? t('register.submitting') : t('register.submit')}
      </button>

      <p className="text-center text-base text-cd-muted">
        {t('register.loginPrompt')}{' '}
        <Link
          to="/login"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('register.loginLink')}
        </Link>
      </p>
    </form>
  )
}
