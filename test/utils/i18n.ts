import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../../src/i18n/locales/en.json'
import pl from '../../src/i18n/locales/pl.json'

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
