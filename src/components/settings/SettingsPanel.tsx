'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { authService } from '../../auth/authService'
import {
  cdBodyMuted,
  cdBtnPrimaryLink,
  cdEyebrow,
  cdPageTitle,
  cdSectionLabel,
} from '../ui/uiStyles'
import { ChangePasswordForm } from './ChangePasswordForm'

export function SettingsPanel() {
  const { t } = useTranslation()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(authService.hasActiveSession())
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className={cdBodyMuted}>{t('settings.loginHint')}</p>
        <Link href="/login" className={cdBtnPrimaryLink}>
          {t('settings.loginCta')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className={cdEyebrow}>{t('settings.eyebrow')}</p>
        <h1 className={cdPageTitle}>{t('settings.title')}</h1>
        <p className={`mt-1 max-w-xl ${cdBodyMuted}`}>{t('settings.subtitle')}</p>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="change-password-heading">
        <div>
          <h2 id="change-password-heading" className={cdSectionLabel}>
            {t('settings.changePassword.heading')}
          </h2>
          <p className={`mt-1 ${cdBodyMuted}`}>{t('settings.changePassword.subtitle')}</p>
        </div>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
