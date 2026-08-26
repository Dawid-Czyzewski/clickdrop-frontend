import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from '../../src/api/client'
import { setSession } from '../../src/auth/session'

describe('apiRequest', () => {
  it('returns parsed JSON on success', async () => {
    const payload = { id: 1, email: 'a@b.c', role: 'USER', token: 'abc' }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(payload),
      }),
    )

    const data = await apiRequest<{ id: number }>('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.c', password: 'secret' },
      auth: false,
    })

    expect(data).toEqual(payload)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.c', password: 'secret' }),
      }),
    )
  })

  it('attaches Bearer token when authenticated', async () => {
    setSession({
      token: 'jwt-abc',
      id: 1,
      email: 'a@b.c',
      role: 'USER',
    })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      }),
    )

    await apiRequest('/api/me')

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-abc',
        }),
      }),
    )
  })

  it('returns undefined for empty success body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      }),
    )

    await expect(
      apiRequest<void>('/api/auth/resend-verification', {
        method: 'POST',
        body: { email: 'a@b.c' },
        auth: false,
      }),
    ).resolves.toBeUndefined()
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

    await expect(
      apiRequest('/api/auth/login', { method: 'POST', body: {}, auth: false }),
    ).rejects.toMatchObject({
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

    await expect(apiRequest('/api/auth/login', { auth: false })).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        message: 'Request failed (500)',
      }),
    )
  })
})
