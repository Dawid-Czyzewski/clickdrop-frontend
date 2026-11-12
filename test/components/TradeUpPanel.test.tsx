import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TradeUpPanel } from '../../src/components/tradeUp/TradeUpPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  sellInventoryBatch: vi.fn(),
  getCases: vi.fn(),
  openCase: vi.fn(),
}))

vi.mock('../../src/api/tradeUpApi', () => ({
  tradeUp: vi.fn(),
  tradeUpApi: { tradeUp: vi.fn() },
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getInventory } from '../../src/api/casesApi'
import { tradeUp } from '../../src/api/tradeUpApi'
import { getBalance } from '../../src/api/economyApi'

const getInventoryMock = vi.mocked(getInventory)
const tradeUpMock = vi.mocked(tradeUp)
const getBalanceMock = vi.mocked(getBalance)

function milSpec(id: number) {
  return {
    inventoryItemId: id,
    itemId: id,
    code: `USP_${id}`,
    displayName: `USP ${id}`,
    rarity: 'MIL_SPEC' as const,
    exterior: 'FIELD_TESTED' as const,
    suggestedSellPrice: 15,
    createdAt: '2026-01-01T00:00:00Z',
  }
}

function login() {
  authService.setSession({
    token: 'jwt',
    refreshToken: 'refresh',
    id: 1,
    email: 'player@clickdrop.test',
    role: 'USER',
  })
  getBalanceMock.mockResolvedValue({ balance: 50 })
}

describe('TradeUpPanel', () => {
  beforeEach(() => {
    authService.logout()
    getInventoryMock.mockReset()
    tradeUpMock.mockReset()
    getBalanceMock.mockReset()
  })

  it('keeps submit locked until exactly 10 same rarity are selected', async () => {
    login()
    getInventoryMock.mockResolvedValue(Array.from({ length: 12 }, (_, i) => milSpec(i + 1)))
    const user = userEvent.setup()
    renderWithProviders(<TradeUpPanel />)

    await screen.findByRole('heading', { name: /trade up 10 skins/i })
    const review = screen.getByRole('button', { name: /review trade-up/i })
    expect(review).toBeDisabled()

    const checkboxes = await screen.findAllByRole('checkbox')
    for (let i = 0; i < 9; i += 1) {
      await user.click(checkboxes[i]!)
    }
    expect(review).toBeDisabled()

    await user.click(checkboxes[9]!)
    expect(review).toBeEnabled()
  })

  it('happy path: confirm modal then result after mocked trade-up', async () => {
    login()
    const inventory = Array.from({ length: 10 }, (_, i) => milSpec(i + 1))
    getInventoryMock
      .mockResolvedValueOnce(inventory)
      .mockResolvedValueOnce([
        {
          inventoryItemId: 99,
          itemId: 2,
          code: 'AK_REDLINE',
          displayName: 'AK Redline',
          rarity: 'RESTRICTED' as const,
          exterior: 'FIELD_TESTED' as const,
          suggestedSellPrice: 40,
          createdAt: '2026-01-01T00:00:00Z',
        },
      ])
    tradeUpMock.mockResolvedValue({
      inventoryItemId: 99,
      itemId: 2,
      code: 'AK_REDLINE',
      displayName: 'AK Redline',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      statTrack: false,
      suggestedSellPrice: 40,
    })

    const user = userEvent.setup()
    renderWithProviders(<TradeUpPanel />)

    await screen.findByRole('heading', { name: /trade up 10 skins/i })
    for (const checkbox of await screen.findAllByRole('checkbox')) {
      await user.click(checkbox)
    }

    await user.click(screen.getByRole('button', { name: /review trade-up/i }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirm trade-up/i }))

    await waitFor(() => {
      expect(tradeUpMock).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })
    const dialog = await screen.findByRole('dialog')
    expect(screen.getByRole('heading', { name: /you received/i })).toBeInTheDocument()
    expect(dialog).toHaveTextContent(/ak redline/i)
  })
})
