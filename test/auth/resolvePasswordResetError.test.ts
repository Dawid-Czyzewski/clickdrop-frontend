import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import {
  resolveForgotPasswordError,
  resolveResetPasswordError,
} from '../../src/auth/resolvePasswordResetError'

const t = (key: string) => key

describe('resolvePasswordResetError', () => {
  it('maps forgot-password errors', () => {
    expect(resolveForgotPasswordError(new ApiError(400, 'x'), t)).toBe(
      'forgotPassword.validationError',
    )
    expect(resolveForgotPasswordError(new ApiError(503, 'x'), t)).toBe(
      'forgotPassword.errorServer',
    )
    expect(resolveForgotPasswordError(new Error('boom'), t)).toBe(
      'forgotPassword.networkError',
    )
  })

  it('maps reset-password token errors', () => {
    expect(
      resolveResetPasswordError(new ApiError(400, 'Expired password reset token'), t),
    ).toBe('resetPassword.expired')
    expect(
      resolveResetPasswordError(new ApiError(400, 'Invalid password reset token'), t),
    ).toBe('resetPassword.invalid')
  })
})
