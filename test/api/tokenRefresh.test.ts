import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '../../src/auth/authService'
import {
  forceLogoutAndRedirect,
  refreshAccessToken,
  resetRefreshState,
} from '../../src/api/tokenRefresh'

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

describe('tokenRefresh', () => {
  beforeEach(() => {
    localStorage.clear()
    resetRefreshState()
    axiosPost.mockReset()
  })

  it('stores rotated tokens from refresh response', async () => {
    authService.setSession({
      token: 'old-access',
      refreshToken: 'old-refresh',
      id: 1,
      email: 'a@b.c',
      role: 'USER',
    })
    axiosPost.mockResolvedValue({
      data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
    })

    await expect(refreshAccessToken()).resolves.toBe('new-access')
    expect(authService.getToken()).toBe('new-access')
    expect(authService.getRefreshToken()).toBe('new-refresh')
  })

  it('deduplicates concurrent refresh calls', async () => {
    authService.setSession({
      token: 'old-access',
      refreshToken: 'old-refresh',
      id: 1,
      email: 'a@b.c',
      role: 'USER',
    })

    let resolvePost!: (value: unknown) => void
    axiosPost.mockReturnValue(
      new Promise((resolve) => {
        resolvePost = resolve
      }) as never,
    )

    const first = refreshAccessToken()
    const second = refreshAccessToken()

    resolvePost({
      data: { accessToken: 'shared-access', refreshToken: 'shared-refresh' },
    })

    await expect(Promise.all([first, second])).resolves.toEqual([
      'shared-access',
      'shared-access',
    ])
    expect(axiosPost).toHaveBeenCalledTimes(1)
  })

  it('logs out and redirects when refresh token is missing', async () => {
    const assignSpy = vi.fn()
    vi.stubGlobal('location', { pathname: '/dashboard', assign: assignSpy })

    await expect(refreshAccessToken()).rejects.toThrow('Missing refresh token')
    expect(assignSpy).toHaveBeenCalledWith('/login')
  })

  it('forceLogoutAndRedirect clears session', () => {
    authService.setSession({
      token: 'access',
      refreshToken: 'refresh',
      id: 1,
      email: 'a@b.c',
      role: 'USER',
    })
    const assignSpy = vi.fn()
    vi.stubGlobal('location', { pathname: '/dashboard', assign: assignSpy })

    forceLogoutAndRedirect()

    expect(authService.hasActiveSession()).toBe(false)
    expect(assignSpy).toHaveBeenCalledWith('/login')
  })
})
