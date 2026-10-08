import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveRecentDropsError } from '../../src/api/resolveRecentDropsError'

const t = (key: string) => key

describe('resolveRecentDropsError', () => {
  it('maps server errors', () => {
    expect(resolveRecentDropsError(new ApiError(503, 'x'), t)).toBe(
      'home.recentDrops.errorServer',
    )
  })

  it('falls back for unknown errors', () => {
    expect(resolveRecentDropsError(new Error('boom'), t)).toBe('home.recentDrops.error')
    expect(resolveRecentDropsError(new ApiError(400, 'x'), t)).toBe('home.recentDrops.error')
  })
})
