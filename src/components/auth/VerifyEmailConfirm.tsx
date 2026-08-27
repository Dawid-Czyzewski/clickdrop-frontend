import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clearPendingVerificationEmail } from '../../auth/pendingVerification'
import {
  mapVerifyEmailError,
  type VerifyTokenStatus,
} from '../../auth/mapVerifyEmailError'
import { verifyEmailOnce } from '../../auth/verifyEmailOnce'
import { AuthResultPanel } from './AuthResultPanel'

type VerifyEmailConfirmProps = {
  token: string
}

export function VerifyEmailConfirm({ token }: VerifyEmailConfirmProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<VerifyTokenStatus>('loading')

  useEffect(() => {
    let cancelled = false

    async function verify() {
      try {
        await verifyEmailOnce(token)
        if (!cancelled) {
          clearPendingVerificationEmail()
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setStatus(mapVerifyEmailError(err))
        }
      }
    }

    void verify()
    return () => {
      cancelled = true
    }
  }, [token])

  if (status === 'loading') {
    return (
      <p className="text-center text-base text-cd-muted" role="status">
        {t('verifyEmail.confirming')}
      </p>
    )
  }

  if (status === 'success' || status === 'alreadyVerified') {
    return (
      <AuthResultPanel
        tone="success"
        message={
          status === 'alreadyVerified'
            ? t('verifyEmail.alreadyVerified')
            : t('verifyEmail.success')
        }
      />
    )
  }

  if (status === 'expired') {
    return <AuthResultPanel tone="danger" message={t('verifyEmail.expired')} />
  }

  if (status === 'invalid') {
    return <AuthResultPanel tone="danger" message={t('verifyEmail.invalid')} />
  }

  return <AuthResultPanel tone="danger" message={t('verifyEmail.confirmError')} />
}
