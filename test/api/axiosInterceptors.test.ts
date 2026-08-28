import { describe, expect, it } from 'vitest'
import { attachAuthHeader, handleUnauthorized } from '../../src/api/axiosInterceptors'
import { authService, setSession } from '../../src/auth/authService'

describe('axios interceptors', () => {
  it('adds Bearer token from authService', () => {
    setSession({
      token: 'jwt-interceptor',
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    const config = attachAuthHeader({
      headers: {},
    } as never)

    expect(config.headers.Authorization).toBe('Bearer jwt-interceptor')
  })

  it('skips Authorization header when skipAuth is true', () => {
    setSession({
      token: 'jwt-interceptor',
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    const config = attachAuthHeader({
      headers: {},
      skipAuth: true,
    } as never)

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('logs out on 401 for authenticated requests', async () => {
    setSession({
      token: 'jwt-expired',
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    await expect(
      handleUnauthorized({
        response: { status: 401 },
        config: { skipAuth: false },
      } as never),
    ).rejects.toBeDefined()

    expect(authService.hasActiveSession()).toBe(false)
  })

  it('does not log out on 401 for public requests', async () => {
    setSession({
      token: 'jwt-expired',
      id: 1,
      email: 'user@clickdrop.test',
      role: 'USER',
    })

    await expect(
      handleUnauthorized({
        response: { status: 401 },
        config: { skipAuth: true },
      } as never),
    ).rejects.toBeDefined()

    expect(authService.hasActiveSession()).toBe(true)
    authService.logout()
  })
})
