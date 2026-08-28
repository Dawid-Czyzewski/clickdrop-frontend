import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveLoginError } from '../../src/auth/resolveLoginError'

const t = ((key: string) => key) as never

describe('resolveLoginError', () => {
  it('maps 401 to invalid credentials', () => {
    expect(resolveLoginError(new ApiError(401, 'Unauthorized'), t)).toEqual({
      kind: 'message',
      message: 'login.invalidCredentials',
    })
  })

  it('maps 403 to not verified', () => {
    expect(
      resolveLoginError(
        new ApiError(403, 'Account is not verified. Please confirm your email'),
        t,
      ),
    ).toEqual({ kind: 'notVerified' })
  })

  it('maps network errors', () => {
    expect(resolveLoginError(new Error('offline'), t)).toEqual({
      kind: 'message',
      message: 'login.networkError',
    })
  })
})
