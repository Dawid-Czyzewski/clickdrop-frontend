import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('authApi.verifyEmail', () => {
  it('calls GET /api/auth/verify-email with token query', async () => {
    requestMock.mockResolvedValue({ data: { message: 'Email verified successfully' } })

    const result = await authApi.verifyEmail('activation-token')

    expect(result).toEqual({ message: 'Email verified successfully' })
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/verify-email?token=activation-token',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })
})
