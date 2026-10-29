import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import pl from './locales/pl.json'

export function detectClientLanguage(): 'en' | 'pl' {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem('i18nextLng')
    if (stored?.startsWith('pl')) return 'pl'
    if (stored?.startsWith('en')) return 'en'
  } catch {
  }
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('pl')) {
    return 'pl'
  }
  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
