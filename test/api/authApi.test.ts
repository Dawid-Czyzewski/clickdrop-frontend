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
})
