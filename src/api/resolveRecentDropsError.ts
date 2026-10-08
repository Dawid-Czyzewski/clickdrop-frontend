import { ApiError } from './client'

export function resolveRecentDropsError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status >= 500) return t('home.recentDrops.errorServer')
  }

  return t('home.recentDrops.error')
}
