import { beforeEach, describe, expect, it, vi } from 'vitest'
import { tradeUp, tradeUpApi } from '../../src/api/tradeUpApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('tradeUpApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('POSTs inventoryItemIds to /api/economy/trade-up', async () => {
    const ids = Array.from({ length: 10 }, (_, i) => i + 1)
    requestMock.mockResolvedValue({
      data: {
        inventoryItemId: 99,
        itemId: 2,
        code: 'AK_REDLINE',
        displayName: 'AK Redline',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        statTrack: false,
        floatValue: 0.25,
        paintSeed: 123,
        suggestedSellPrice: 40,
      },
    })

    const result = await tradeUp(ids)

    expect(result.code).toBe('AK_REDLINE')
    expect(tradeUpApi.tradeUp).toBe(tradeUp)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/trade-up',
      method: 'POST',
      data: { inventoryItemIds: ids },
      headers: undefined,
      skipAuth: false,
    })
  })
})
