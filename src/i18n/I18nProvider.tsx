'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './index'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized)

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true)
      return
    }

    const onInitialized = () => setReady(true)
    i18n.on('initialized', onInitialized)
    return () => {
      i18n.off('initialized', onInitialized)
    }
  }, [])

  if (!ready) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
