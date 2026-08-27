import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { mapVerifyEmailError } from '../../src/auth/mapVerifyEmailError'

describe('mapVerifyEmailError', () => {
  it('maps expired token message', () => {
    expect(mapVerifyEmailError(new ApiError(400, 'Verification token is Expired'))).toBe(
      'expired',
    )
  })

  it('maps invalid token message', () => {
    expect(mapVerifyEmailError(new ApiError(400, 'Invalid verification token'))).toBe(
      'invalid',
    )
  })

  it('maps already verified message', () => {
    expect(mapVerifyEmailError(new ApiError(400, 'Account already verified'))).toBe(
      'alreadyVerified',
    )
  })

  it('maps unknown errors', () => {
    expect(mapVerifyEmailError(new Error('offline'))).toBe('error')
  })
})
