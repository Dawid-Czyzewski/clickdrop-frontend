import type { LoginResponse } from '../api/authApi'

const AUTH_USER_KEY = 'clickdrop_auth_user'

export type AuthUser = LoginResponse

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null
}
