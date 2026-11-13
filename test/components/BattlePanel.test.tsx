import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BattlePanel } from '../../src/components/battles/BattlePanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getCases: vi.fn(),
  getCaseDrops: vi.fn(),
  openCase: vi.fn(),
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  sellInventoryBatch: vi.fn(),
}))

vi.mock('../../src/api/battlesApi', () => ({
  createBattle: vi.fn(),
  joinBattle: vi.fn(),
  getBattle: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getCases } from '../../src/api/casesApi'
import { createBattle } from '../../src/api/battlesApi'
import { getBalance } from '../../src/api/economyApi'

const getCasesMock = vi.mocked(getCases)
const createBattleMock = vi.mocked(createBattle)
const getBalanceMock = vi.mocked(getBalance)

function login() {
  authService.setSession({
    token: 'jwt',
    refreshToken: 'refresh',
    id: 15,
    email: 'player@clickdrop.test',
    role: 'USER',
  })
  getBalanceMock.mockResolvedValue({ balance: 500 })
}

const gameCase = {
  id: 3,
  code: 'CS20_CASE',
  displayName: 'CS20 Case',
  price: 65,
  sortOrder: 1,
}

const finishedBattle = {
  id: 9,
  caseId: 3,
  rounds: 1 as const,
  status: 'FINISHED' as const,
  player1UserId: 15,
  player2UserId: null,
  player1TotalValue: 40,
  player2TotalValue: 10,
  winnerUserId: 15,
  entryCost: 65,
  roundsDrops: [
    {
      roundIndex: 0,
      side: 'PLAYER1' as const,
      itemId: 1,
      itemCode: 'USP_A',
      itemDisplayName: 'USP A',
      rarity: 'MIL_SPEC' as const,
      exterior: 'FIELD_TESTED' as const,
      statTrack: false,
      value: 40,
      inventoryItemId: 101,
    },
    {
      roundIndex: 0,
      side: 'PLAYER2' as const,
      itemId: 2,
      itemCode: 'AK_B',
      itemDisplayName: 'AK B',
      rarity: 'RESTRICTED' as const,
      exterior: 'BATTLE_SCARRED' as const,
      statTrack: false,
      value: 10,
      inventoryItemId: 102,
    },
  ],
}

describe('BattlePanel', () => {
  beforeEach(() => {
    authService.logout()
    getCasesMock.mockReset()
    createBattleMock.mockReset()
    getBalanceMock.mockReset()
    vi.useRealTimers()
  })

  it('shows stake preview and locks start without funds', async () => {
    login()
    getBalanceMock.mockResolvedValue({ balance: 10 })
    getCasesMock.mockResolvedValue([gameCase])

    const user = userEvent.setup()
    renderWithProviders(<BattlePanel />)

    await screen.findByRole('heading', { name: /battle a bot/i })
    await user.selectOptions(screen.getByLabelText(/case/i), '3')
    expect(screen.getByText(/not enough clickdollars/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start vs bot/i })).toBeDisabled()
  })

  it('plays vs bot and shows winner banner', async () => {
    login()
    getCasesMock.mockResolvedValue([gameCase])
    createBattleMock.mockResolvedValue(finishedBattle)
    getBalanceMock
      .mockResolvedValueOnce({ balance: 500 })
      .mockResolvedValueOnce({ balance: 435 })

    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProviders(<BattlePanel />)

    await screen.findByRole('heading', { name: /battle a bot/i })
    await user.selectOptions(screen.getByLabelText(/case/i), '3')
    await user.click(screen.getByRole('button', { name: /start vs bot/i }))

    await waitFor(() => {
      expect(createBattleMock).toHaveBeenCalledWith({
        caseId: 3,
        rounds: 1,
        vsBot: true,
      })
    })

    await act(async () => {
      vi.advanceTimersByTime(900)
    })

    expect(await screen.findByRole('heading', { name: /you win/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open inventory/i })).toHaveAttribute(
      'href',
      '/inventory',
    )
  })
})
