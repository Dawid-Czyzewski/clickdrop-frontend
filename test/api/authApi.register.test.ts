import { describe, expect, it, vi } from 'vitest'
import { authApi } from '../../src/api/authApi'

describe('authApi.register', () => {
  it('posts registration payload to /api/auth/register', async () => {
    const response = {
      id: 10,
      email: 'player@clickdrop.test',
      username: 'playerone',
      role: 'USER',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => response,
      }),
    )

    const result = await authApi.register({
      email: 'player@clickdrop.test',
      username: 'playerone',
      password: 'secret123',
    })

    expect(result).toEqual(response)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'player@clickdrop.test',
          username: 'playerone',
          password: 'secret123',
        }),
      }),
    )
  })
})
