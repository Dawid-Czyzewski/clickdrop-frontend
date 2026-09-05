import axios from 'axios'
import { authService } from '../auth/authService'
import type { TokenResponse } from './authApi'
import { getApiBaseUrl } from './env'

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

const API_BASE_URL = getApiBaseUrl()

let isRefreshing = false
let queue: QueueItem[] = []

function flushQueue(error: unknown, token: string | null) {
  queue.forEach((item) => {
    if (error || !token) {
      item.reject(error ?? new Error('Token refresh failed'))
      return
    }
    item.resolve(token)
  })
  queue = []
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  if (window.location.pathname === '/login') return
  window.location.assign('/login')
}

export function forceLogoutAndRedirect(): void {
  authService.logout()
  redirectToLogin()
}

async function requestTokenRefresh(refreshToken: string): Promise<TokenResponse> {
  const { data } = await axios.post<TokenResponse>(
    `${API_BASE_URL}/api/auth/refresh`,
    { refreshToken },
    { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
  )
  return data
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = authService.getRefreshToken()
  if (!refreshToken) {
    forceLogoutAndRedirect()
    throw new Error('Missing refresh token')
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      queue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const tokens = await requestTokenRefresh(refreshToken)
    authService.setTokens(tokens.accessToken, tokens.refreshToken)
    flushQueue(null, tokens.accessToken)
    return tokens.accessToken
  } catch (error) {
    flushQueue(error, null)
    forceLogoutAndRedirect()
    throw error
  } finally {
    isRefreshing = false
  }
}

export function resetRefreshState(): void {
  isRefreshing = false
  queue = []
}
