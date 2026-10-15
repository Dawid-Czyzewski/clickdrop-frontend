'use client'

import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth/AuthLayout'
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm'

export function ForgotPasswordPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout title={t('forgotPassword.title')}>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
