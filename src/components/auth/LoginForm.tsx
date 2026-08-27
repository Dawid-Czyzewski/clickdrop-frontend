import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { ApiError } from '../../api/client'
import { setSession } from '../../auth/session'
import { authInputClassName, authSubmitClassName } from './authStyles'

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const user = await authApi.login({ email, password })
      setSession(user)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(t('login.invalidCredentials'))
        } else if (err.status === 400) {
          setError(t('login.validationError'))
        } else {
          setError(t('login.error'))
        }
      } else {
        setError(t('login.networkError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="login-email" className="text-sm font-medium uppercase tracking-wider text-cd-muted">
          {t('login.email')}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={authInputClassName}
          placeholder={t('login.emailPlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="login-password" className="text-sm font-medium uppercase tracking-wider text-cd-muted">
          {t('login.password')}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInputClassName}
          placeholder={t('login.passwordPlaceholder')}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-cd-danger">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting ? t('login.submitting') : t('login.submit')}
      </button>

      <p className="text-center text-base text-cd-muted">
        {t('login.registerPrompt')}{' '}
        <Link
          to="/register"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('login.registerLink')}
        </Link>
      </p>
    </form>
  )
}
