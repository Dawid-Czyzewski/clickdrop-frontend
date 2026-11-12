import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  claimCollection,
  collectionsApi,
  getCollection,
  getCollections,
} from '../../src/api/collectionsApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('collectionsApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('lists collections', async () => {
    requestMock.mockResolvedValue({
      data: [
        {
          code: 'CS20_CASE',
          displayName: 'CS20 Case',
          sortOrder: 1,
          owned: 0,
          total: 17,
          completed: false,
          rewardCd: 850,
          rewardClaimed: false,
        },
      ],
    })

    const rows = await getCollections()
    expect(rows[0]?.code).toBe('CS20_CASE')
    expect(collectionsApi.getCollections).toBe(getCollections)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/collections',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })

  it('loads detail and claims', async () => {
    requestMock
      .mockResolvedValueOnce({
        data: {
          code: 'CS20_CASE',
          displayName: 'CS20 Case',
          sortOrder: 1,
          owned: 17,
          total: 17,
          completed: true,
          rewardCd: 850,
          rewardClaimed: false,
          items: [],
        },
      })
      .mockResolvedValueOnce({
        data: { code: 'CS20_CASE', rewardCd: 850, balance: 900 },
      })

    await getCollection('CS20_CASE')
    const claim = await claimCollection('CS20_CASE')

    expect(claim.balance).toBe(900)
    expect(requestMock).toHaveBeenNthCalledWith(2, {
      url: '/api/economy/collections/CS20_CASE/claim',
      method: 'POST',
      data: undefined,
      headers: undefined,
      skipAuth: false,
    })
  })
})
