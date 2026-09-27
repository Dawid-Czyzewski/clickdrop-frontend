import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  casesApi,
  getCaseDrops,
  getCases,
  getInventory,
  openCase,
  sellInventoryItem,
} from '../../src/api/casesApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('casesApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getCases calls GET /api/economy/cases without auth', async () => {
    requestMock.mockResolvedValue({
      data: [{ id: 1, code: 'REVOLUTION_CASE', displayName: 'Revolution Case', price: 50, sortOrder: 1 }],
    })

    const result = await getCases()

    expect(result[0]?.code).toBe('REVOLUTION_CASE')
    expect(casesApi.getCases).toBe(getCases)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/cases',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })

  it('getCaseDrops calls GET /api/economy/cases/{id}/drops without auth', async () => {
    requestMock.mockResolvedValue({
      data: [
        {
          itemId: 1,
          code: 'GLOCK_18_UMBRAL_RABBIT',
          displayName: 'Glock-18 | Umbral Rabbit',
          rarity: 'MIL_SPEC',
          weight: 50,
        },
        {
          itemId: 6,
          code: 'AK_47_ASIIMOV',
          displayName: 'AK-47 | Asiimov',
          rarity: 'COVERT',
          weight: 5,
        },
      ],
    })

    const result = await getCaseDrops(1)

    expect(result).toHaveLength(2)
    expect(casesApi.getCaseDrops).toBe(getCaseDrops)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/cases/1/drops',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })

  it('openCase posts to /api/economy/cases/{id}/open without body', async () => {
    requestMock.mockResolvedValue({
      data: {
        inventoryItemId: 9,
        itemCode: 'AK_47_SLATE',
        itemDisplayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        balance: 50,
        cost: 50,
        suggestedSellPrice: 40,
      },
    })

    const result = await openCase(1)

    expect(result.itemCode).toBe('AK_47_SLATE')
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/cases/1/open',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('getInventory and sellInventoryItem use authenticated inventory endpoints', async () => {
    requestMock
      .mockResolvedValueOnce({
        data: [
          {
            inventoryItemId: 9,
            itemId: 3,
            code: 'AK_47_SLATE',
            displayName: 'AK-47 | Slate',
            rarity: 'RESTRICTED',
            exterior: 'FIELD_TESTED',
            suggestedSellPrice: 40,
            createdAt: '2026-01-01T00:00:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({ data: { balance: 90, soldFor: 40 } })

    await expect(getInventory()).resolves.toHaveLength(1)
    await expect(sellInventoryItem(9)).resolves.toEqual({ balance: 90, soldFor: 40 })

    expect(requestMock).toHaveBeenNthCalledWith(1, {
      url: '/api/economy/inventory/me',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
    expect(requestMock).toHaveBeenNthCalledWith(2, {
      url: '/api/economy/inventory/9/sell',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
