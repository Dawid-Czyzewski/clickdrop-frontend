import i18n from './index'

export type AppLanguage = 'en' | 'pl'

export function persistAppLanguage(lng: AppLanguage): void {
  try {
    window.localStorage.setItem('i18nextLng', lng)
  } catch {
  }
}

export function setAppLanguage(lng: AppLanguage): Promise<void> {
  persistAppLanguage(lng)
  return i18n.changeLanguage(lng).then(() => undefined)
}
