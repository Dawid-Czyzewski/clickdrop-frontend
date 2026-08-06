import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth/AuthLayout'
import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout
      title={t('login.title')}
      seoTitle={t('seo.login.title')}
      seoDescription={t('seo.login.description')}
      path="/login"
    >
      <LoginForm />
    </AuthLayout>
  )
}
