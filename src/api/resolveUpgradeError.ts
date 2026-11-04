import { ApiError } from './client'

type Translate = (key: string, options?: Record<string, unknown>) => string

export function resolveUpgradeError(err: unknown, t: Translate): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('upgrades.insufficientFunds')
    if (err.status === 401) return t('upgrades.errorUnauthorized')
    if (err.status === 403) {
      const level = err.details?.requiredLevel
      if (level != null) {
        return t('upgrades.errorLevelLocked', { level })
      }
      return t('upgrades.errorLevelLockedGeneric')
    }
    if (err.status === 404) return t('upgrades.errorNotFound')
    if (err.status >= 500) return t('upgrades.errorServer')
  }

  return t('upgrades.error')
}
