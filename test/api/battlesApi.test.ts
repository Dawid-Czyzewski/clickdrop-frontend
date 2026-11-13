import { beforeEach, describe, expect, it, vi } from 'vitest'
import { battlesApi, createBattle } from '../../src/api/battlesApi'

const requestMock = vi.hoisted(() => vi.fn())

vi.mock('../../src/api/axiosClient', () => ({
  API_BASE_URL: 'http://localhost:8081',
  apiClient: {
    request: requestMock,
  },
}))

describe('battlesApi', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('creates a vs-bot battle', async () => {
    requestMock.mockResolvedValue({
      data: {
        id: 9,
        caseId: 3,
        rounds: 1,
        status: 'FINISHED',
        player1UserId: 15,
        player2UserId: null,
        player1TotalValue: 40,
        player2TotalValue: 10,
        winnerUserId: 15,
        entryCost: 65,
        roundsDrops: [],
      },
    })

    const result = await createBattle({ caseId: 3, rounds: 1, vsBot: true })
    expect(result.id).toBe(9)
    expect(battlesApi.createBattle).toBe(createBattle)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/api/economy/battles',
      method: 'POST',
      data: { caseId: 3, rounds: 1, vsBot: true },
      headers: undefined,
      skipAuth: false,
    })
  })
})
