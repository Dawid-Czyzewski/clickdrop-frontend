import { ApiError } from '../api/client'

export function resolveChangePasswordError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase()
    if (err.status === 400 && message.includes('current')) {
      return t('settings.changePassword.wrongCurrent')
    }
    if (err.status === 400) return t('settings.changePassword.validationError')
    if (err.status === 401) return t('settings.changePassword.errorUnauthorized')
    if (err.status >= 500) return t('settings.changePassword.errorServer')
    return t('settings.changePassword.error')
  }

  return t('settings.changePassword.networkError')
}
