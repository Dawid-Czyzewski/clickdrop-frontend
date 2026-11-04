import { ApiError } from './client'

type Translate = (key: string, options?: Record<string, unknown>) => string

function isOpenCountForbidden(err: ApiError): boolean {
  if (err.details?.requestedCount != null) return true
  return /case open ×\d+/i.test(err.message)
}

export function resolveCaseError(err: unknown, t: Translate): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('cases.insufficientFunds')
    if (err.status === 401) return t('cases.errorUnauthorized')
    if (err.status === 403) {
      if (isOpenCountForbidden(err)) {
        const level = err.details?.requiredLevel
        const count = err.details?.requestedCount
        if (level != null && count != null) {
          return t('cases.errorOpenCountLocked', { level, count })
        }
        return t('cases.errorOpenCountLockedGeneric')
      }
      return t('cases.errorLevelLocked')
    }
    if (err.status === 404) return t('cases.errorNotFound')
    if (err.status === 429) return t('cases.errorTooFast')
    if (err.status >= 500) return t('cases.errorServer')
  }

  return t('cases.error')
}
