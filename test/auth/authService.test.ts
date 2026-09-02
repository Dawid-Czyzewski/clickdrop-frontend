import { beforeEach, describe, expect, it } from 'vitest'
import {
  authService,
  getAuthUser,
  getRefreshToken,
  getToken,
  hasActiveSession,
  logout,
  setSession,
} from '../../src/auth/authService'

const session = {
  token: 'jwt-test-token',
  refreshToken: 'refresh-test-token',
  id: 1,
  email: 'user@clickdrop.test',
  role: 'USER' as const,
}

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no session is stored', () => {
    expect(getAuthUser()).toBeNull()
    expect(getToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(hasActiveSession()).toBe(false)
  })

  it('stores access token, refresh token and user from login response', () => {
    setSession(session)

    expect(getToken()).toBe('jwt-test-token')
    expect(getRefreshToken()).toBe('refresh-test-token')
    expect(getAuthUser()).toEqual({
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })
    expect(hasActiveSession()).toBe(true)
  })

  it('updates both tokens via setTokens', () => {
    setSession(session)
    authService.setTokens('new-access', 'new-refresh')

    expect(getToken()).toBe('new-access')
    expect(getRefreshToken()).toBe('new-refresh')
  })

  it('removes access token, refresh token and user on logout', () => {
    setSession(session)
    logout()

    expect(getToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(getAuthUser()).toBeNull()
    expect(hasActiveSession()).toBe(false)
  })
})
