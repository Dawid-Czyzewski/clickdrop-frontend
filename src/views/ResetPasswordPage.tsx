'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '../components/auth/AuthLayout'
import { authSubmitClassName } from '../components/auth/authStyles'
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')?.trim() ?? ''

  return (
    <AuthLayout title={t('resetPassword.title')}>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col items-center gap-5 text-center">
          <p role="alert" className="text-base text-cd-danger">
            {t('resetPassword.missingToken')}
          </p>
          <Link
            href="/forgot-password"
            className={`${authSubmitClassName} inline-flex justify-center no-underline`}
          >
            {t('resetPassword.requestNewLink')}
          </Link>
          <Link
            href="/login"
            className="cursor-pointer text-sm font-medium text-cd-accent transition hover:text-cd-accent-hover hover:underline"
          >
            {t('resetPassword.loginLink')}
          </Link>
        </div>
      )}
    </AuthLayout>
  )
}
