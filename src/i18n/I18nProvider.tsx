'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { detectClientLanguage } from './index'
import { persistAppLanguage, setAppLanguage } from './setAppLanguage'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const preferred = detectClientLanguage()
      if (!i18n.language.startsWith(preferred)) {
        await setAppLanguage(preferred)
      } else {
        persistAppLanguage(preferred)
      }
      if (!cancelled) setReady(true)
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
