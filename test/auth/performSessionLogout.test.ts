import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { performSessionLogout } from '../../src/auth/performSessionLogout'

vi.mock('../../src/api/authApi', () => ({
  authApi: {
    logout: vi.fn(),
  },
}))

import { authApi } from '../../src/api/authApi'

const logoutMock = vi.mocked(authApi.logout)

describe('performSessionLogout', () => {
  beforeEach(() => {
    authService.logout()
    logoutMock.mockReset()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh-to-revoke',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
  })

  it('calls logout API, clears storage, and navigates', async () => {
    logoutMock.mockResolvedValue(undefined)
    const navigate = vi.fn()

    await performSessionLogout(navigate)

    expect(logoutMock).toHaveBeenCalledWith({ refreshToken: 'refresh-to-revoke' })
    expect(authService.hasActiveSession()).toBe(false)
    expect(authService.getRefreshToken()).toBeNull()
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('clears storage and navigates even when logout API fails', async () => {
    logoutMock.mockRejectedValue(new ApiError(503, 'down'))
    const navigate = vi.fn()

    await performSessionLogout(navigate, '/login')

    expect(logoutMock).toHaveBeenCalledWith({ refreshToken: 'refresh-to-revoke' })
    expect(authService.hasActiveSession()).toBe(false)
    expect(authService.getRefreshToken()).toBeNull()
    expect(navigate).toHaveBeenCalledWith('/login')
  })

  it('skips API when there is no refresh token but still clears and navigates', async () => {
    authService.logout()
    localStorage.setItem('clickdrop_auth_token', 'orphan-access')
    const navigate = vi.fn()

    await performSessionLogout(navigate)

    expect(logoutMock).not.toHaveBeenCalled()
    expect(authService.hasActiveSession()).toBe(false)
    expect(navigate).toHaveBeenCalledWith('/')
  })
})
