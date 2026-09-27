import { ApiError } from './client'

export function resolveSkinUpgradeError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('skinUpgrade.errorNoTargets')
    if (err.status === 401) return t('skinUpgrade.errorUnauthorized')
    if (err.status === 404) return t('skinUpgrade.errorNotFound')
    if (err.status >= 500) return t('skinUpgrade.errorServer')
  }

  return t('skinUpgrade.error')
}
