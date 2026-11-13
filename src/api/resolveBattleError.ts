import { ApiError } from './client'

export function resolveBattleError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    const msg = err.message.toLowerCase()
    if (err.status === 400) {
      if (msg.includes('insufficient')) return t('battles.errorFunds')
      if (msg.includes('rounds')) return t('battles.errorRounds')
      return t('battles.error')
    }
    if (err.status === 409) return t('battles.errorInProgress')
    if (err.status === 401) return t('battles.errorUnauthorized')
    if (err.status === 404) return t('battles.errorNotFound')
    if (err.status >= 500) return t('battles.errorServer')
  }

  return t('battles.error')
}
