import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('authApi.register', () => {
  it('posts registration payload to /api/auth/register', async () => {
    const response = {
      id: 10,
      email: 'player@clickdrop.test',
      username: 'playerone',
      role: 'USER',
    }

    requestMock.mockResolvedValue({ data: response })

    const result = await authApi.register({
      email: 'player@clickdrop.test',
      username: 'playerone',
      password: 'secret123',
    })

    expect(result).toEqual(response)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/register',
      method: 'POST',
      data: {
        email: 'player@clickdrop.test',
        username: 'playerone',
        password: 'secret123',
      },
      headers: undefined,
      skipAuth: true,
    })
  })
})
