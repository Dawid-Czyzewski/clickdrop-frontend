import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveLeaderboardError } from '../../src/api/resolveLeaderboardError'

const t = (key: string) => key

describe('resolveLeaderboardError', () => {
  it('maps server errors', () => {
    expect(resolveLeaderboardError(new ApiError(503, 'x'), t)).toBe(
      'leaderboard.errorServer',
    )
  })

  it('falls back for unknown errors', () => {
    expect(resolveLeaderboardError(new Error('boom'), t)).toBe('leaderboard.error')
  })
})
