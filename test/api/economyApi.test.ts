import { describe, expect, it, vi } from 'vitest'
import { clickToEarn, economyApi, getBalance } from '../../src/api/economyApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('economyApi', () => {
  it('getBalance calls GET /api/economy/balance with auth', async () => {
    requestMock.mockResolvedValue({ data: { balance: 12.5 } })

    const result = await getBalance()

    expect(result).toEqual({ balance: 12.5 })
    expect(economyApi.getBalance).toBe(getBalance)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/balance',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('clickToEarn calls POST /api/economy/click with auth', async () => {
    requestMock.mockResolvedValue({ data: { balance: 15, earned: 1 } })

    const result = await clickToEarn()

    expect(result).toEqual({ balance: 15, earned: 1 })
    expect(economyApi.clickToEarn).toBe(clickToEarn)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/click',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
