import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CaseDetailPanel } from '../../src/components/cases/CaseDetailPanel'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getCases: vi.fn(),
  getCaseDrops: vi.fn(),
  openCase: vi.fn(),
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getCaseDrops, getInventory, openCase, sellInventoryItem } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getCaseDropsMock = vi.mocked(getCaseDrops)
const openCaseMock = vi.mocked(openCase)
const getInventoryMock = vi.mocked(getInventory)
const sellMock = vi.mocked(sellInventoryItem)
const getBalanceMock = vi.mocked(getBalance)

const anvil = { id: 1, code: 'ANVIL', price: 50, sortOrder: 1 }

describe('CaseDetailPanel', () => {
  beforeEach(() => {
    authService.logout()
    getCaseDropsMock.mockReset()
    openCaseMock.mockReset()
    getInventoryMock.mockReset()
    sellMock.mockReset()
    getBalanceMock.mockReset()
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    getCaseDropsMock.mockResolvedValue([
      { itemId: 1, code: 'GLOCK_WATER_ELEMENTAL', rarity: 'MIL_SPEC', weight: 50 },
      { itemId: 3, code: 'AK_REDLINE', rarity: 'RESTRICTED', weight: 15 },
      { itemId: 6, code: 'AWP_ASIIMOV', rarity: 'COVERT', weight: 5 },
      { itemId: 2, code: 'USP_GUARDIAN', rarity: 'MIL_SPEC', weight: 30 },
    ])
    getInventoryMock.mockResolvedValue([])
  })

  it('shows drop chances for each skin', async () => {
    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    expect(await screen.findByText('Glock | Water Elemental')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Anvil' })).toHaveAttribute('src', '/cases/ANVIL.webp')
    expect(screen.getByRole('img', { name: 'Glock | Water Elemental' })).toHaveAttribute(
      'src',
      '/items/GLOCK_WATER_ELEMENTAL.webp',
    )
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('5%')).toBeInTheDocument()
  })

  it('opens a case, shows result, and keep goes to inventory', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue({
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      balance: 50,
      cost: 50,
      suggestedSellPrice: 40,
    })
    getInventoryMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
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

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await screen.findByRole('button', { name: /^open$/i })
    await user.click(screen.getByRole('button', { name: /^open$/i }))

    expect(await screen.findByRole('button', { name: /keep in inventory/i })).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveTextContent('Field-Tested')

    await user.click(screen.getByRole('button', { name: /keep in inventory/i }))

    await waitFor(() => {
      expect(getMockRouter().push).toHaveBeenCalledWith('/inventory')
    })
  })

  it('opens a case and can sell the drop immediately', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue({
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      balance: 50,
      cost: 50,
      suggestedSellPrice: 40,
    })
    getInventoryMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
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

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await screen.findByRole('button', { name: /^open$/i })
    await user.click(screen.getByRole('button', { name: /^open$/i }))

    expect(await screen.findByRole('button', { name: /sell for 40.00 cd/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
