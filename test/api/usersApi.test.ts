import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCurrentUser,
  getLeaderboard,
  getMyLeaderboardRank,
  usersApi,
} from '../../src/api/usersApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('usersApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getCurrentUser calls GET /api/users/me with auth enabled', async () => {
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

  it('getLeaderboard calls GET /api/users/leaderboard without auth', async () => {
    requestMock.mockResolvedValue({
      data: [
        { rank: 1, username: 'ace', level: 12, experience: 340 },
        { rank: 2, username: 'bravo', level: 10, experience: 80 },
      ],
    })

    const result = await getLeaderboard()

    expect(result).toHaveLength(2)
    expect(result[0]?.username).toBe('ace')
    expect(usersApi.getLeaderboard).toBe(getLeaderboard)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/users/leaderboard?limit=20',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })

  it('getMyLeaderboardRank calls GET /api/users/leaderboard/me with auth', async () => {
    const mine = { rank: 42, username: 'player', level: 7, experience: 210 }
    requestMock.mockResolvedValue({ data: mine })

    const result = await getMyLeaderboardRank()

    expect(result).toEqual(mine)
    expect(usersApi.getMyLeaderboardRank).toBe(getMyLeaderboardRank)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/users/leaderboard/me',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
