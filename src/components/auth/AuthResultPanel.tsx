import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authSubmitClassName } from './authStyles'

type AuthResultPanelProps = {
  message: string
  tone?: 'success' | 'danger' | 'muted'
}

const toneClass = {
  success: 'text-cd-accent',
  danger: 'text-cd-danger',
  muted: 'text-cd-muted',
} as const

export function AuthResultPanel({ message, tone = 'muted' }: AuthResultPanelProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p role={tone === 'danger' ? 'alert' : 'status'} className={`text-base ${toneClass[tone]}`}>
        {message}
      </p>
      <Link to="/login" className={`${authSubmitClassName} inline-flex justify-center no-underline`}>
        {t('verifyEmail.goToLogin')}
      </Link>
    </div>
  )
}
