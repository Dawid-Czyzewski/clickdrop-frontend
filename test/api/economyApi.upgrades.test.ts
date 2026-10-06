import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buyUpgrade,
  collectIdle,
  economyApi,
  getBalance,
  getMyUpgrades,
} from '../../src/api/economyApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('economyApi upgrades', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getMyUpgrades calls GET /api/economy/upgrades/me with auth', async () => {
    const payload = [
      {
        id: 1,
        code: 'BETTER_MOUSE',
        tier: 1,
        price: 50,
        clickPower: 1,
        level: 2,
        nextCost: 50,
        incomePerSecond: 0,
      },
    ]
    requestMock.mockResolvedValue({ data: payload })

    const result = await getMyUpgrades()

    expect(result).toEqual(payload)
    expect(economyApi.getMyUpgrades).toBe(getMyUpgrades)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/upgrades/me',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('buyUpgrade posts to /api/economy/upgrades/{id}/buy without body amount', async () => {
    requestMock.mockResolvedValue({
      data: { upgradeId: 1, code: 'BETTER_MOUSE', level: 3, balance: 40, cost: 50 },
    })

    const result = await buyUpgrade(1)

    expect(result).toEqual({
      upgradeId: 1,
      code: 'BETTER_MOUSE',
      level: 3,
      balance: 40,
      cost: 50,
    })
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/upgrades/1/buy',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
    expect(economyApi.getBalance).toBe(getBalance)
  })

  it('collectIdle posts to /api/economy/idle/collect', async () => {
    requestMock.mockResolvedValue({
      data: { earned: 1.5, balance: 42.5, incomePerSecond: 0.1 },
    })

    const result = await collectIdle()

    expect(result).toEqual({ earned: 1.5, balance: 42.5, incomePerSecond: 0.1 })
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/idle/collect',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
    expect(economyApi.collectIdle).toBe(collectIdle)
  })

  it('getIdleStatus calls GET /api/economy/idle', async () => {
    requestMock.mockResolvedValue({
      data: {
        pending: 3.2,
        incomePerSecond: 0.1,
        lastIdleCollectedAt: '2026-10-06T12:00:00Z',
      },
    })

    const { getIdleStatus } = await import('../../src/api/economyApi')
    const result = await getIdleStatus()

    expect(result.pending).toBe(3.2)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/idle',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
