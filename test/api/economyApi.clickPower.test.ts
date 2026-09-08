import { beforeEach, describe, expect, it, vi } from 'vitest'
import { economyApi, getClickPower } from '../../src/api/economyApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('economyApi.getClickPower', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('calls GET /api/economy/click-power with auth', async () => {
    requestMock.mockResolvedValue({ data: { rewardPerClick: 4 } })

    const result = await getClickPower()

    expect(result).toEqual({ rewardPerClick: 4 })
    expect(economyApi.getClickPower).toBe(getClickPower)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/click-power',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
