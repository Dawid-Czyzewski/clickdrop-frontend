import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SkinUpgradePanel } from '../../src/components/skinUpgrade/SkinUpgradePanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  getCases: vi.fn(),
  openCase: vi.fn(),
}))

vi.mock('../../src/api/skinUpgradeApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/api/skinUpgradeApi')>()
  return {
    ...actual,
    getSkinUpgradePreview: vi.fn(),
    upgradeSkin: vi.fn(),
  }
})

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getInventory, sellInventoryItem } from '../../src/api/casesApi'
import { getSkinUpgradePreview, upgradeSkin } from '../../src/api/skinUpgradeApi'
import { getBalance } from '../../src/api/economyApi'

const getInventoryMock = vi.mocked(getInventory)
const previewMock = vi.mocked(getSkinUpgradePreview)
const upgradeMock = vi.mocked(upgradeSkin)
const sellMock = vi.mocked(sellInventoryItem)
const getBalanceMock = vi.mocked(getBalance)

const inventoryItem = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

const preview = {
  inventoryItemId: 9,
  current: {
    itemCode: 'AK_47_SLATE',
    itemDisplayName: 'AK-47 | Slate',
    rarity: 'RESTRICTED' as const,
    exterior: 'FIELD_TESTED' as const,
    suggestedSellPrice: 40,
  },
  successChance: 0.5,
  possibleTargets: [
    {
      itemId: 3,
      itemCode: 'AK_47_SLATE',
      itemDisplayName: 'AK-47 | Slate',
      rarity: 'RESTRICTED' as const,
      exterior: 'MINIMAL_WEAR' as const,
      suggestedSellPrice: 48,
    },
  ],
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
  getInventoryMock.mockResolvedValue([inventoryItem])
}

describe('SkinUpgradePanel', () => {
  beforeEach(() => {
    authService.logout()
    getInventoryMock.mockReset()
    previewMock.mockReset()
    upgradeMock.mockReset()
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
  })

  it('renders preview after selecting a skin', async () => {
    const user = userEvent.setup()
    login()
    previewMock.mockResolvedValue(preview)

    renderWithProviders(<SkinUpgradePanel />)

    expect(await screen.findByText('AK-47 | Slate')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /ak-47 \| slate/i }))

    expect(await screen.findByText(/50% better skin \/ 50% you lose this one/i)).toBeInTheDocument()
    expect(screen.getByText(/minimal wear/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^upgrade$/i })).toBeInTheDocument()
    expect(previewMock).toHaveBeenCalledWith(9)
  })

  it('shows SUCCESS keep/sell modal after upgrade', async () => {
    const user = userEvent.setup()
    login()
    previewMock.mockResolvedValue(preview)
    upgradeMock.mockResolvedValue({
      result: 'SUCCESS',
      inventoryItemId: 12,
      itemCode: 'AK_47_SLATE',
      itemDisplayName: 'AK-47 | Slate',
      rarity: 'RESTRICTED',
      exterior: 'MINIMAL_WEAR',
      suggestedSellPrice: 48,
    })

    renderWithProviders(<SkinUpgradePanel />)

    await user.click(await screen.findByRole('button', { name: /ak-47 \| slate/i }))
    await user.click(await screen.findByRole('button', { name: /^upgrade$/i }))
    await user.click(screen.getByRole('button', { name: /confirm upgrade/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(upgradeMock).toHaveBeenCalledWith(9, {
      targetItemId: 3,
      targetExterior: 'MINIMAL_WEAR',
    })
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sell/i })).toBeInTheDocument()
  })

  it('shows FAIL skin lost UI after upgrade', async () => {
    const user = userEvent.setup()
    login()
    previewMock.mockResolvedValue(preview)
    upgradeMock.mockResolvedValue({ result: 'FAIL' })

    renderWithProviders(<SkinUpgradePanel />)

    await user.click(await screen.findByRole('button', { name: /ak-47 \| slate/i }))
    await user.click(await screen.findByRole('button', { name: /^upgrade$/i }))
    await user.click(screen.getByRole('button', { name: /confirm upgrade/i }))

    expect(await screen.findByText(/skin lost/i)).toBeInTheDocument()
    expect(screen.getByText(/your skin is gone/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(upgradeMock).toHaveBeenCalledWith(9, {
        targetItemId: 3,
        targetExterior: 'MINIMAL_WEAR',
      })
    })
  })
})
