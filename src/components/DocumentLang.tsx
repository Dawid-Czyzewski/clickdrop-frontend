'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function DocumentLang() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('pl') ? 'pl' : 'en'
  }, [i18n.language])

  return null
}
