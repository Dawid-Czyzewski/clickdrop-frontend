import { describe, expect, it } from 'vitest'
import {
  authService,
  getAuthUser,
  getToken,
  hasActiveSession,
  logout,
  setSession,
} from '../../src/auth/authService'

const session = {
  token: 'jwt-test-token',
  id: 1,
  email: 'user@clickdrop.test',
  role: 'USER' as const,
}

describe('authService', () => {
  it('returns null when no session is stored', () => {
    expect(getAuthUser()).toBeNull()
    expect(getToken()).toBeNull()
    expect(hasActiveSession()).toBe(false)
    expect(authService.hasActiveSession()).toBe(false)
  })

  it('stores token and user from login response', () => {
    setSession(session)

    expect(getToken()).toBe('jwt-test-token')
    expect(authService.getToken()).toBe('jwt-test-token')
    expect(getAuthUser()).toEqual({
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })
    expect(hasActiveSession()).toBe(true)
  })

  it('removes token and user on logout', () => {
    setSession(session)
    logout()

    expect(getToken()).toBeNull()
    expect(getAuthUser()).toBeNull()
    expect(hasActiveSession()).toBe(false)
  })

  it('clears session through authService.logout', () => {
    authService.setSession(session)
    authService.logout()

    expect(authService.getToken()).toBeNull()
    expect(authService.getAuthUser()).toBeNull()
    expect(authService.hasActiveSession()).toBe(false)
  })

  it('returns null for invalid JSON in user storage', () => {
    localStorage.setItem('clickdrop_auth_token', 'jwt-test-token')
    localStorage.setItem('clickdrop_auth_user', '{broken')

    expect(getAuthUser()).toBeNull()
    expect(getToken()).toBe('jwt-test-token')
    expect(hasActiveSession()).toBe(true)
  })
})
