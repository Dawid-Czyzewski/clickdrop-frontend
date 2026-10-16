import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveChangePasswordError } from '../../src/auth/resolveChangePasswordError'

const t = (key: string) => key

describe('resolveChangePasswordError', () => {
  it('maps wrong current password', () => {
    expect(
      resolveChangePasswordError(new ApiError(400, 'Current password is incorrect'), t),
    ).toBe('settings.changePassword.wrongCurrent')
  })

  it('maps unauthorized and server errors', () => {
    expect(resolveChangePasswordError(new ApiError(401, 'x'), t)).toBe(
      'settings.changePassword.errorUnauthorized',
    )
    expect(resolveChangePasswordError(new ApiError(503, 'x'), t)).toBe(
      'settings.changePassword.errorServer',
    )
  })
})
