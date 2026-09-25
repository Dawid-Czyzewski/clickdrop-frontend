import { beforeEach, describe, expect, it, vi } from 'vitest'
import { claimDaily, dailyApi, getDailyStatus } from '../../src/api/dailyApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('dailyApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getDailyStatus calls GET /api/economy/daily/status', async () => {
    requestMock.mockResolvedValue({
      data: { available: true, nextClaimAt: null },
    })

    const result = await getDailyStatus()

    expect(result.available).toBe(true)
    expect(dailyApi.getDailyStatus).toBe(getDailyStatus)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/daily/status',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('claimDaily posts to /api/economy/daily/claim without body', async () => {
    requestMock.mockResolvedValue({
      data: {
        inventoryItemId: 9,
        itemCode: 'AK_REDLINE',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        suggestedSellPrice: 40,
        nextClaimAt: '2026-09-26T15:00:00Z',
      },
    })

    const result = await claimDaily()

    expect(result.itemCode).toBe('AK_REDLINE')
    expect(dailyApi.claimDaily).toBe(claimDaily)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/daily/claim',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
