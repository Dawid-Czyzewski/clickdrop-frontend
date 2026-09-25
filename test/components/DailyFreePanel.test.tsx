import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DailyFreePanel } from '../../src/components/daily/DailyFreePanel'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/dailyApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/api/dailyApi')>()
  return {
    ...actual,
    getDailyStatus: vi.fn(),
    getDailyDrops: vi.fn(),
    claimDaily: vi.fn(),
  }
})

vi.mock('../../src/api/casesApi', () => ({
  sellInventoryItem: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { claimDaily, getDailyDrops, getDailyStatus } from '../../src/api/dailyApi'
import { sellInventoryItem } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getStatusMock = vi.mocked(getDailyStatus)
const getDropsMock = vi.mocked(getDailyDrops)
const claimMock = vi.mocked(claimDaily)
const sellMock = vi.mocked(sellInventoryItem)
const getBalanceMock = vi.mocked(getBalance)

const dailyDrops = [
  {
    type: 'SKIN' as const,
    itemId: 3,
    itemCode: 'AK_REDLINE',
    rarity: 'RESTRICTED' as const,
    weight: 10,
  },
  { type: 'CASH' as const, cashAmount: 5, weight: 40 },
]

describe('DailyFreePanel', () => {
  beforeEach(() => {
    authService.logout()
    getStatusMock.mockReset()
    getDropsMock.mockReset()
    claimMock.mockReset()
    sellMock.mockReset()
    getBalanceMock.mockReset()
    getBalanceMock.mockResolvedValue({ balance: 50 })
    getDropsMock.mockResolvedValue(dailyDrops)
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

  it('renders possible drops and login CTA for guests', async () => {
    renderWithProviders(<DailyFreePanel />)

    expect(await screen.findByRole('heading', { name: /daily free/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in to open/i })).toHaveAttribute(
      'href',
      '/login',
    )
    expect(screen.getByText('AK-47 | Redline')).toBeInTheDocument()
    expect(screen.getByText('ClickDollars')).toBeInTheDocument()
    expect(screen.getByText(/5\.00 CD/)).toBeInTheDocument()
    expect(getStatusMock).not.toHaveBeenCalled()
    expect(getDropsMock).toHaveBeenCalled()
  })

  it('opens skin claim, shows result, and can sell', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue({
      type: 'SKIN',
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      suggestedSellPrice: 40,
      nextClaimAt: '2026-09-26T15:00:00.000Z',
    })
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    renderWithProviders(<DailyFreePanel />)

    await user.click(await screen.findByRole('button', { name: /^open$/i }))

    expect(await screen.findByRole('dialog')).toHaveTextContent('AK-47 | Redline')
    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('opens cash claim and shows cash result with new balance', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue({
      type: 'CASH',
      cashAmount: 12.5,
      balance: 62.5,
      nextClaimAt: '2026-09-26T15:00:00.000Z',
    })

    renderWithProviders(<DailyFreePanel />)

    await user.click(await screen.findByRole('button', { name: /^open$/i }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent(/\+12\.50 ClickDollars/)
    expect(dialog).toHaveTextContent(/62\.50/)
    expect(sellMock).not.toHaveBeenCalled()
  })

  it('shows countdown when claim is locked', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    const next = new Date(Date.now() + 90 * 60 * 1000).toISOString()
    getStatusMock.mockResolvedValue({ available: false, nextClaimAt: next })

    renderWithProviders(<DailyFreePanel />)

    expect(await screen.findByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument()
    expect(await screen.findByText('AK-47 | Redline')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^open$/i })).not.toBeInTheDocument()
  })

  it('keep navigates to inventory after skin win', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue({
      type: 'SKIN',
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      suggestedSellPrice: 40,
      nextClaimAt: '2026-09-26T15:00:00.000Z',
    })

    renderWithProviders(<DailyFreePanel />)

    await user.click(await screen.findByRole('button', { name: /^open$/i }))
    await user.click(await screen.findByRole('button', { name: /keep in inventory/i }))

    expect(getMockRouter().push).toHaveBeenCalledWith('/inventory')
  })
})
