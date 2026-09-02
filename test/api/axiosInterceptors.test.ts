import axios from 'axios'
import { AxiosError, AxiosHeaders } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachAuthHeader, createUnauthorizedHandler } from '../../src/api/axiosInterceptors'
import { authService, setSession } from '../../src/auth/authService'
import { resetRefreshState } from '../../src/api/tokenRefresh'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
      create: actual.default.create,
    },
  }
})

const axiosPost = vi.mocked(axios.post)

const session = {
  token: 'jwt-access',
  refreshToken: 'jwt-refresh',
  id: 1,
  email: 'user@clickdrop.test',
  role: 'USER' as const,
}

describe('axios interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
    resetRefreshState()
    axiosPost.mockReset()
  })

  it('adds Bearer token from authService', () => {
    setSession(session)

    const config = attachAuthHeader({
      headers: new AxiosHeaders(),
    } as never)

    expect(config.headers.Authorization).toBe('Bearer jwt-access')
  })

  it('skips Authorization header when skipAuth is true', () => {
    setSession(session)

    const config = attachAuthHeader({
      headers: new AxiosHeaders(),
      skipAuth: true,
    } as never)

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('refreshes token and retries original request on 401', async () => {
    setSession(session)
    axiosPost.mockResolvedValue({
      data: { accessToken: 'jwt-new-access', refreshToken: 'jwt-new-refresh' },
    })

    const requestMock = vi.fn().mockResolvedValue({ data: { ok: true } })
    const handleUnauthorized = createUnauthorizedHandler({ request: requestMock } as never)

    const config = {
      url: '/api/users/me',
      headers: new AxiosHeaders({ Authorization: 'Bearer jwt-access' }),
      skipAuth: false,
    }

    const result = await handleUnauthorized(
      new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config as never, {}, {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: config as never,
      }),
    )

    expect(axiosPost).toHaveBeenCalledWith(
      'http://localhost:8081/api/auth/refresh',
      { refreshToken: 'jwt-refresh' },
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    )
    expect(authService.getToken()).toBe('jwt-new-access')
    expect(authService.getRefreshToken()).toBe('jwt-new-refresh')
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/users/me',
        _retry: true,
        headers: expect.objectContaining({ Authorization: 'Bearer jwt-new-access' }),
      }),
    )
    expect(result).toEqual({ data: { ok: true } })
  })

  it('logs out and redirects when refresh fails', async () => {
    setSession(session)
    axiosPost.mockRejectedValue(new Error('invalid refresh'))
    const assignSpy = vi.fn()
    vi.stubGlobal('location', { pathname: '/dashboard', assign: assignSpy })

    const handleUnauthorized = createUnauthorizedHandler({ request: vi.fn() } as never)
    const config = {
      url: '/api/users/me',
      headers: new AxiosHeaders(),
      skipAuth: false,
    }

    await expect(
      handleUnauthorized(
        new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config as never, {}, {
          status: 401,
          data: {},
          statusText: 'Unauthorized',
          headers: {},
          config: config as never,
        }),
      ),
    ).rejects.toBeDefined()

    expect(authService.hasActiveSession()).toBe(false)
    expect(assignSpy).toHaveBeenCalledWith('/login')
  })

  it('does not refresh for public requests', async () => {
    setSession(session)
    const handleUnauthorized = createUnauthorizedHandler({ request: vi.fn() } as never)

    await expect(
      handleUnauthorized({
        response: { status: 401 },
        config: { skipAuth: true },
      } as never),
    ).rejects.toBeDefined()

    expect(axiosPost).not.toHaveBeenCalled()
    expect(authService.hasActiveSession()).toBe(true)
  })
})
