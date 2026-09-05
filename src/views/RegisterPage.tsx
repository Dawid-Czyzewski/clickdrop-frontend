'use client'

import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth/AuthLayout'
import { RegisterForm } from '../components/auth/RegisterForm'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout title={t('register.title')}>
      <RegisterForm />
    </AuthLayout>
  )
}
