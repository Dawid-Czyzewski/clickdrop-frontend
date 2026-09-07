import { ApiError } from './client'

export function resolveEconomyError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return t('home.earn.errorUnauthorized')
    if (err.status === 404) return t('home.earn.errorNotFound')
    if (err.status === 429) return t('home.earn.errorTooFast')
    if (err.status >= 500) return t('home.earn.errorServer')
  }

  return t('home.earn.error')
}
