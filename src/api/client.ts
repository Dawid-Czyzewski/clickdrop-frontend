import { isAxiosError } from 'axios'
import { apiClient } from './axiosClient'

export class ApiError extends Error {
  readonly status: number
  readonly details?: Record<string, string>

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
}

function resolveErrorMessage(status: number, data: unknown): string {
  if (data && typeof data === 'object') {
    const payload = data as { message?: string; error?: string }
    if (payload.message) return payload.message
    if (payload.error) return payload.error
  }

  return `Request failed (${status})`
}

function resolveErrorDetails(data: unknown): Record<string, string> | undefined {
  if (!data || typeof data !== 'object') return undefined
  const details: Record<string, string> = {}
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (key === 'message' || key === 'error') continue
    if (typeof value === 'string') details[key] = value
  }
  return Object.keys(details).length > 0 ? details : undefined
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, auth = true, method = 'GET' } = options

  try {
    const response = await apiClient.request<T>({
      url: path,
      method,
      data: body,
      headers,
      skipAuth: !auth,
    })

    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500
      const data = error.response?.data
      throw new ApiError(
        status,
        resolveErrorMessage(status, data),
        resolveErrorDetails(data),
      )
    }

    throw error
  }
}

export { apiClient } from './axiosClient'
