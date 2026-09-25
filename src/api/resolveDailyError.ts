import { ApiError } from './client'

export function resolveDailyError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400 || err.status === 429) return t('daily.errorTooEarly')
    if (err.status === 401) return t('daily.errorUnauthorized')
    if (err.status >= 500) return t('daily.errorServer')
  }

  return t('daily.error')
}
