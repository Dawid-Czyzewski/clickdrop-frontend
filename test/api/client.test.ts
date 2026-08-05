import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from '../../src/api/client'

describe('apiRequest', () => {
  it('returns parsed JSON on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 1, email: 'a@b.c', role: 'USER' }),
      }),
    )

    const data = await apiRequest<{ id: number }>('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.c', password: 'secret' },
    })

    expect(data).toEqual({ id: 1, email: 'a@b.c', role: 'USER' })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.c', password: 'secret' }),
      }),
    )
  })

  it('throws ApiError with message from response body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password' }),
      }),
    )

    await expect(apiRequest('/api/auth/login', { method: 'POST', body: {} })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid email or password',
    } satisfies Partial<ApiError>)
  })

  it('throws ApiError when error body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('no json')
        },
      }),
    )

    await expect(apiRequest('/api/auth/login')).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        message: 'Request failed (500)',
      }),
    )
  })
})
