import { describe, expect, it } from 'vitest'
import {
  clearAuthUser,
  getAuthUser,
  getToken,
  isAuthenticated,
  setSession,
} from '../src/auth/session'

const session = {
  token: 'jwt-test-token',
  id: 1,
  email: 'user@clickdrop.test',
  role: 'USER' as const,
}

describe('session', () => {
  it('returns null when no session is stored', () => {
    expect(getAuthUser()).toBeNull()
    expect(getToken()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('stores token and user from login response', () => {
    setSession(session)

    expect(getToken()).toBe('jwt-test-token')
    expect(getAuthUser()).toEqual({
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })
    expect(isAuthenticated()).toBe(true)
  })

  it('clears token and user', () => {
    setSession(session)
    clearAuthUser()

    expect(getToken()).toBeNull()
    expect(getAuthUser()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('returns null for invalid JSON in user storage', () => {
    localStorage.setItem('clickdrop_auth_token', 'jwt-test-token')
    localStorage.setItem('clickdrop_auth_user', '{broken')

    expect(getAuthUser()).toBeNull()
    expect(getToken()).toBe('jwt-test-token')
    expect(isAuthenticated()).toBe(true)
  })
})
