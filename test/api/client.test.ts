import { AxiosError } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from '../../src/api/client'
import { setSession } from '../../src/auth/authService'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('apiRequest', () => {
  it('returns parsed JSON on success', async () => {
    const payload = { id: 1, email: 'a@b.c', role: 'USER', token: 'abc' }
    requestMock.mockResolvedValue({ data: payload })

    const data = await apiRequest<{ id: number }>('/api/auth/login', {
      method: 'POST',
      body: { email: 'a@b.c', password: 'secret' },
      auth: false,
    })

    expect(data).toEqual(payload)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/auth/login',
      method: 'POST',
      data: { email: 'a@b.c', password: 'secret' },
      headers: undefined,
      skipAuth: true,
    })
  })

  it('sends authenticated requests through axios client', async () => {
    setSession({
      token: 'jwt-abc',
      refreshToken: 'refresh-abc',
      id: 1,
      email: 'a@b.c',
      role: 'USER',
    })
    requestMock.mockResolvedValue({ data: { ok: true } })

    await apiRequest('/api/me')

    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/me',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('returns undefined for empty success body', async () => {
    requestMock.mockResolvedValue({ data: undefined })

    await expect(
      apiRequest<void>('/api/auth/resend-verification', {
        method: 'POST',
        body: { email: 'a@b.c' },
        auth: false,
      }),
    ).resolves.toBeUndefined()
  })

  it('throws ApiError with message from response body', async () => {
    requestMock.mockRejectedValue(
      new AxiosError(
        'Unauthorized',
        'ERR_BAD_REQUEST',
        { skipAuth: true } as never,
        {},
        {
          status: 401,
          data: { message: 'Invalid email or password' },
        } as never,
      ),
    )

    await expect(
      apiRequest('/api/auth/login', { method: 'POST', body: {}, auth: false }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid email or password',
    } satisfies Partial<ApiError>)
  })

  it('throws ApiError when error body has no message', async () => {
    requestMock.mockRejectedValue(
      new AxiosError(
        'Server error',
        'ERR_BAD_RESPONSE',
        { skipAuth: true } as never,
        {},
        {
          status: 500,
          data: 'Internal Server Error',
        } as never,
      ),
    )

    await expect(apiRequest('/api/auth/login', { auth: false })).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        message: 'Request failed (500)',
      }),
    )
  })
})
