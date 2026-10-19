import { ApiError } from '../api/client'

export function resolveLogoutAllError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t('settings.logoutAll.errorUnauthorized')
    if (err.status >= 500) return t('settings.logoutAll.errorServer')
    return t('settings.logoutAll.error')
  }

  return t('settings.logoutAll.networkError')
}
