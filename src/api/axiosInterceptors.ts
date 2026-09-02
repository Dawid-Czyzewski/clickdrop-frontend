import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { authService } from '../auth/authService'
import { forceLogoutAndRedirect, refreshAccessToken } from './tokenRefresh'

export function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (config.skipAuth) {
    return config
  }

  const token = authService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

function isAuthRefreshRequest(config?: InternalAxiosRequestConfig): boolean {
  const url = config?.url ?? ''
  return url.includes('/api/auth/refresh')
}

export function createUnauthorizedHandler(client: AxiosInstance) {
  return async function handleUnauthorized(error: AxiosError) {
    const { config, response } = error

    if (response?.status !== 401 || !config || config.skipAuth) {
      return Promise.reject(error)
    }

    if (config._retry || isAuthRefreshRequest(config)) {
      forceLogoutAndRedirect()
      return Promise.reject(error)
    }

    config._retry = true

    try {
      const accessToken = await refreshAccessToken()
      config.headers.Authorization = `Bearer ${accessToken}`
      return client.request(config)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
}
