import { isAxiosError } from 'axios'
import { apiClient } from './axiosClient'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
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
      throw new ApiError(status, resolveErrorMessage(status, error.response?.data))
    }

    throw error
  }
}

export { apiClient } from './axiosClient'
