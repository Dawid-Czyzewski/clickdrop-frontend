import { ApiError } from './client'

export function resolveTradeUpError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return t('tradeUp.errorInvalid')
    if (err.status === 401) return t('tradeUp.errorUnauthorized')
    if (err.status === 404) return t('tradeUp.errorNotFound')
    if (err.status >= 500) return t('tradeUp.errorServer')
  }

  return t('tradeUp.error')
}
