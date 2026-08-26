import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth/AuthLayout'
import { VerifyEmailPanel } from '../components/auth/VerifyEmailPanel'

export function VerifyEmailPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout
      title={t('verifyEmail.title')}
      seoTitle={t('seo.verifyEmail.title')}
      seoDescription={t('seo.verifyEmail.description')}
      path="/verify-email"
    >
      <VerifyEmailPanel />
    </AuthLayout>
  )
}
