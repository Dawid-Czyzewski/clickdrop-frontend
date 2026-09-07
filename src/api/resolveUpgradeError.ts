import { ApiError } from './client'

export function resolveUpgradeError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('upgrades.insufficientFunds')
    if (err.status === 401) return t('upgrades.errorUnauthorized')
    if (err.status === 404) return t('upgrades.errorNotFound')
    if (err.status >= 500) return t('upgrades.errorServer')
  }

  return t('upgrades.error')
}
