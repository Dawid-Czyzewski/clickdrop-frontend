import { describe, expect, it, vi } from 'vitest'
import { getCurrentUser, usersApi } from '../../src/api/usersApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('usersApi.getCurrentUser', () => {
  it('calls GET /api/users/me with auth enabled', async () => {
    const profile = {
      username: 'player',
      email: 'player@clickdrop.test',
      level: 5,
      experience: 1200,
      clickDollars: 99.5,
    }

    requestMock.mockResolvedValue({ data: profile })

    const result = await getCurrentUser()

    expect(result).toEqual(profile)
    expect(usersApi.getCurrentUser).toBe(getCurrentUser)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/users/me',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
