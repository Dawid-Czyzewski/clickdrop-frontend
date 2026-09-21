import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InventoryPanel } from '../../src/components/inventory/InventoryPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  getCases: vi.fn(),
  openCase: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getInventory, sellInventoryItem } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getInventoryMock = vi.mocked(getInventory)
const sellMock = vi.mocked(sellInventoryItem)
const getBalanceMock = vi.mocked(getBalance)

describe('InventoryPanel', () => {
  beforeEach(() => {
    authService.logout()
    getInventoryMock.mockReset()
    sellMock.mockReset()
    getBalanceMock.mockReset()
  })

  it('shows login CTA for guests', () => {
    renderWithProviders(<InventoryPanel />)

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    expect(getInventoryMock).not.toHaveBeenCalled()
  })

  it('shows kept items from open and sells from inventory', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 50 })
    getInventoryMock.mockResolvedValue([
      {
        inventoryItemId: 9,
        itemId: 3,
        code: 'AK_REDLINE',
        rarity: 'RESTRICTED',
        exterior: 'FIELD_TESTED',
        suggestedSellPrice: 40,
        createdAt: '2026-01-01T00:00:00Z',
      },
    ])
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    renderWithProviders(<InventoryPanel />)

    expect(await screen.findByText('AK-47 | Redline')).toBeInTheDocument()
    expect(screen.getByText('Restricted')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.getByText('90.00 ClickDollars')).toBeInTheDocument()
      expect(screen.queryByText('AK-47 | Redline')).not.toBeInTheDocument()
    })
  })
})
