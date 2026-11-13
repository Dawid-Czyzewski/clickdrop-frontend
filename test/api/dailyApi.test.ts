import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  claimDaily,
  dailyApi,
  getDailyDrops,
  getDailyStatus,
  isDailyCashClaim,
  isDailySkinClaim,
} from '../../src/api/dailyApi'

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

  it('getDailyDrops calls GET /api/economy/daily/drops without auth', async () => {
    requestMock.mockResolvedValue({
      data: [
        { type: 'SKIN', itemId: 3, itemCode: 'AK_47_SLATE', itemDisplayName: 'AK-47 | Slate', rarity: 'RESTRICTED', weight: 10 },
        { type: 'CASH', cashAmount: 5, weight: 40 },
      ],
    })

    const result = await getDailyDrops()

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ type: 'SKIN', itemCode: 'AK_47_SLATE' })
    expect(result[1]).toMatchObject({ type: 'CASH', cashAmount: 5 })
    expect(dailyApi.getDailyDrops).toBe(getDailyDrops)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/daily/drops',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })

  it('claimDaily posts and narrows SKIN vs CASH', async () => {
    requestMock.mockResolvedValue({
      data: {
        type: 'SKIN',
        inventoryItemId: 9,
        itemCode: 'AK_47_SLATE',
        itemDisplayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        floatValue: 0.25,
        paintSeed: 123,
        suggestedSellPrice: 40,
        nextClaimAt: '2026-09-26T15:00:00Z',
      },
    })

    const skin = await claimDaily()

    expect(isDailySkinClaim(skin)).toBe(true)
    expect(isDailyCashClaim(skin)).toBe(false)
    if (isDailySkinClaim(skin)) {
      expect(skin.itemCode).toBe('AK_47_SLATE')
    }
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/daily/claim',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })

    requestMock.mockResolvedValue({
      data: {
        type: 'CASH',
        cashAmount: 12.5,
        balance: 62.5,
        nextClaimAt: '2026-09-26T15:00:00Z',
      },
    })

    const cash = await claimDaily()
    expect(isDailyCashClaim(cash)).toBe(true)
    if (isDailyCashClaim(cash)) {
      expect(cash.cashAmount).toBe(12.5)
      expect(cash.balance).toBe(62.5)
    }
  })
})
