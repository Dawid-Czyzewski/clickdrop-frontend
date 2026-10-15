import { ApiError } from './client'

export function resolveLeaderboardError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status >= 500) return t('leaderboard.errorServer')
  }

  return t('leaderboard.error')
}
