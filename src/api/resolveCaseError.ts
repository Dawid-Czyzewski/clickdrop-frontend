import { ApiError } from './client'

export function resolveCaseError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('cases.insufficientFunds')
    if (err.status === 401) return t('cases.errorUnauthorized')
    if (err.status === 404) return t('cases.errorNotFound')
    if (err.status >= 500) return t('cases.errorServer')
  }

  return t('cases.error')
}
