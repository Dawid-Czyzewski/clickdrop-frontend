import { describe, expect, it } from 'vitest'
import {
  clearAuthUser,
  getAuthUser,
  isAuthenticated,
  setAuthUser,
} from '../src/auth/session'

const user = {
  id: 1,
  email: 'user@clickdrop.test',
  role: 'USER' as const,
}

describe('session', () => {
  it('returns null when no user is stored', () => {
    expect(getAuthUser()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('stores and reads the auth user', () => {
    setAuthUser(user)

    expect(getAuthUser()).toEqual(user)
    expect(isAuthenticated()).toBe(true)
  })

  it('clears the auth user', () => {
    setAuthUser(user)
    clearAuthUser()

    expect(getAuthUser()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('returns null for invalid JSON in storage', () => {
    localStorage.setItem('clickdrop_auth_user', '{broken')

    expect(getAuthUser()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })
})
