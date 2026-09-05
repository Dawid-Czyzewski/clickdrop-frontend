'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/authApi'
import { setPendingVerificationEmail } from '../../auth/pendingVerification'
import { resolveLoginError } from '../../auth/resolveLoginError'
import { authService } from '../../auth/authService'
import { authInputClassName, authSubmitClassName } from './authStyles'

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const session = await authApi.login({ email, password })
      authService.setSession(session)
      router.replace('/')
    } catch (err) {
      const result = resolveLoginError(err, t)
      if (result.kind === 'notVerified') {
        setPendingVerificationEmail(email)
        router.replace('/verify-email')
        return
      }
      setError(result.message)
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
          href="/register"
          className="cursor-pointer font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
        >
          {t('login.registerLink')}
        </Link>
      </p>
    </form>
  )
}
