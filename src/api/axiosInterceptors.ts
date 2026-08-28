import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authService } from '../auth/authService'

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

export function handleUnauthorized(error: AxiosError): Promise<never> {
  if (error.response?.status === 401 && !error.config?.skipAuth) {
    authService.logout()
  }

  return Promise.reject(error)
}
