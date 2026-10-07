import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InventoryPanel } from '../../src/components/inventory/InventoryPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  sellInventoryBatch: vi.fn(),
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

import { getInventory, sellInventoryBatch, sellInventoryItem } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getInventoryMock = vi.mocked(getInventory)
const sellMock = vi.mocked(sellInventoryItem)
const sellBatchMock = vi.mocked(sellInventoryBatch)
const getBalanceMock = vi.mocked(getBalance)

const slate = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

const glock = {
  inventoryItemId: 10,
  itemId: 1,
  code: 'GLOCK_18_UMBRAL_RABBIT',
  displayName: 'Glock-18 | Umbral Rabbit',
  rarity: 'MIL_SPEC' as const,
  exterior: 'MINIMAL_WEAR' as const,
  suggestedSellPrice: 20,
  createdAt: '2026-01-01T00:00:00Z',
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

describe('InventoryPanel', () => {
  beforeEach(() => {
    authService.logout()
    getInventoryMock.mockReset()
    sellMock.mockReset()
    sellBatchMock.mockReset()
    getBalanceMock.mockReset()
  })

  it('shows login CTA for guests', () => {
    renderWithProviders(<InventoryPanel />)

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    expect(getInventoryMock).not.toHaveBeenCalled()
  })

  it('shows kept items from open and sells from inventory', async () => {
    const user = userEvent.setup()
    login()
    getInventoryMock.mockResolvedValue([slate])
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    renderWithProviders(<InventoryPanel />)

    expect(await screen.findByText('AK-47 | Slate')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'AK-47 | Slate' })).toHaveAttribute(
      'src',
      '/items/AK_47_SLATE.webp',
    )
    expect(screen.getByText('Restricted')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.queryByText('AK-47 | Slate')).not.toBeInTheDocument()
    })
  })

  it('sells multiple selected items in one batch request', async () => {
    const user = userEvent.setup()
    login()
    getInventoryMock.mockResolvedValue([slate, glock])
    sellBatchMock.mockResolvedValue({
      soldCount: 2,
      totalEarned: 60,
      balance: 110,
      sold: [
        { inventoryItemId: 9, itemCode: 'AK_47_SLATE', earned: 40 },
        { inventoryItemId: 10, itemCode: 'GLOCK_18_UMBRAL_RABBIT', earned: 20 },
      ],
      skipped: [],
    })

    renderWithProviders(<InventoryPanel />)

    expect(await screen.findByText('AK-47 | Slate')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sell 0 for/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /select all/i }))
    expect(screen.getByRole('button', { name: /sell 2 for 60.00 cd/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /sell 2 for 60.00 cd/i }))
    expect(await screen.findByRole('dialog')).toHaveTextContent(/sell selected skins/i)
    await user.click(screen.getByRole('button', { name: /^sell selected$/i }))

    await waitFor(() => {
      expect(sellBatchMock).toHaveBeenCalledWith([9, 10])
      expect(screen.queryByText('AK-47 | Slate')).not.toBeInTheDocument()
      expect(screen.queryByText('Glock-18 | Umbral Rabbit')).not.toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('Sold for 60.00 CD')
    })
  })
})
