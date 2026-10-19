import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveLogoutAllError } from '../../src/auth/resolveLogoutAllError'

const t = (key: string) => key

describe('resolveLogoutAllError', () => {
  it('maps known statuses', () => {
    expect(resolveLogoutAllError(new ApiError(401, 'x'), t)).toBe(
      'settings.logoutAll.errorUnauthorized',
    )
    expect(resolveLogoutAllError(new ApiError(503, 'x'), t)).toBe(
      'settings.logoutAll.errorServer',
    )
  })

  it('falls back for network errors', () => {
    expect(resolveLogoutAllError(new Error('boom'), t)).toBe(
      'settings.logoutAll.networkError',
    )
  })
})
