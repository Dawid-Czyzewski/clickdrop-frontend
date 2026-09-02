import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('authApi', () => {
  it('posts credentials to /api/auth/login', async () => {
    const response = {
      token: 'jwt-login-token',
      refreshToken: 'jwt-refresh-token',
      id: 42,
      email: 'player@clickdrop.test',
      role: 'USER',
    }

    requestMock.mockResolvedValue({ data: response })

    const result = await authApi.login({
      email: 'player@clickdrop.test',
      password: 'secret123',
    })

    expect(result).toEqual(response)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/login',
      method: 'POST',
      data: {
        email: 'player@clickdrop.test',
        password: 'secret123',
      },
      headers: undefined,
      skipAuth: true,
    })
  })

  it('posts refresh token to /api/auth/refresh', async () => {
    const response = {
      accessToken: 'jwt-new-access',
      refreshToken: 'jwt-new-refresh',
    }
    requestMock.mockResolvedValue({ data: response })

    const result = await authApi.refresh({ refreshToken: 'jwt-old-refresh' })

    expect(result).toEqual(response)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/refresh',
      method: 'POST',
      data: { refreshToken: 'jwt-old-refresh' },
      headers: undefined,
      skipAuth: true,
    })
  })
})
