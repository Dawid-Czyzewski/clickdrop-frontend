import { beforeEach, describe, expect, it, vi } from 'vitest'
import { dropsApi, getRecentDrops } from '../../src/api/dropsApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('dropsApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('getRecentDrops calls GET /api/economy/drops/recent without auth', async () => {
    requestMock.mockResolvedValue({
      data: [
        {
          itemCode: 'AK_47_SLATE',
          displayName: 'AK-47 | Slate',
          rarity: 'RESTRICTED',
          exterior: 'FIELD_TESTED',
          statTrack: false,
          source: 'CASE',
          createdAt: '2026-04-01T12:00:00Z',
        },
      ],
    })

    const result = await getRecentDrops()

    expect(result).toHaveLength(1)
    expect(result[0]?.itemCode).toBe('AK_47_SLATE')
    expect(dropsApi.getRecentDrops).toBe(getRecentDrops)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/drops/recent?limit=20',
      method: 'GET',
      data: undefined,
      headers: undefined,
      skipAuth: true,
    })
  })

  it('getRecentDrops passes custom limit', async () => {
    requestMock.mockResolvedValue({ data: [] })

    await getRecentDrops(10)

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/economy/drops/recent?limit=10',
        skipAuth: true,
      }),
    )
  })
})
