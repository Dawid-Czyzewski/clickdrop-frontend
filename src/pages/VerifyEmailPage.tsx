import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { VerifyEmailConfirm } from '../components/auth/VerifyEmailConfirm'
import { VerifyEmailPanel } from '../components/auth/VerifyEmailPanel'

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''

  const title = token ? t('verifyEmail.confirmTitle') : t('verifyEmail.title')

  return (
    <AuthLayout
      title={title}
      seoTitle={t('seo.verifyEmail.title')}
      seoDescription={t('seo.verifyEmail.description')}
      path="/verify-email"
    >
      {token ? <VerifyEmailConfirm token={token} /> : <VerifyEmailPanel />}
    </AuthLayout>
  )
}
