import type { LoginResponse, Role } from '../api/authApi'

const AUTH_USER_KEY = 'clickdrop_auth_user'
const AUTH_TOKEN_KEY = 'clickdrop_auth_token'

export type AuthUser = {
  id: number
  email: string
  role: Role
}

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setSession(response: LoginResponse): void {
  const { token, id, email, role } = response
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ id, email, role }))
}

export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function hasActiveSession(): boolean {
  return Boolean(getToken())
}

export const authService = {
  getToken,
  getAuthUser,
  setSession,
  logout,
  hasActiveSession,
}
