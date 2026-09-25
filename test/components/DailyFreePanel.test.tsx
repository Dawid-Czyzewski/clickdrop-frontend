import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DailyFreePanel } from '../../src/components/daily/DailyFreePanel'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/dailyApi', () => ({
  getDailyStatus: vi.fn(),
  claimDaily: vi.fn(),
}))

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

import { claimDaily, getDailyStatus } from '../../src/api/dailyApi'
import { sellInventoryItem } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getStatusMock = vi.mocked(getDailyStatus)
const claimMock = vi.mocked(claimDaily)
const sellMock = vi.mocked(sellInventoryItem)
const getBalanceMock = vi.mocked(getBalance)

describe('DailyFreePanel', () => {
  beforeEach(() => {
    authService.logout()
    getStatusMock.mockReset()
    claimMock.mockReset()
    sellMock.mockReset()
    getBalanceMock.mockReset()
    getBalanceMock.mockResolvedValue({ balance: 50 })
  })

  it('shows login CTA for guests', () => {
    renderWithProviders(<DailyFreePanel />)

    expect(screen.getByRole('heading', { name: /daily free/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in to claim/i })).toHaveAttribute(
      'href',
      '/login',
    )
    expect(getStatusMock).not.toHaveBeenCalled()
  })

  it('claims on the page and can sell the drop', async () => {
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
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      suggestedSellPrice: 40,
      nextClaimAt: '2026-09-26T15:00:00.000Z',
    })
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    renderWithProviders(<DailyFreePanel />)

    await user.click(await screen.findByRole('button', { name: /claim free skin/i }))

    expect(await screen.findByRole('dialog')).toHaveTextContent('AK-47 | Redline')
    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('shows page countdown when claim is locked', async () => {
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
    expect(screen.queryByRole('button', { name: /claim free skin/i })).not.toBeInTheDocument()
  })

  it('keep navigates to inventory', async () => {
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
      inventoryItemId: 9,
      itemCode: 'AK_REDLINE',
      rarity: 'RESTRICTED',
      exterior: 'FIELD_TESTED',
      suggestedSellPrice: 40,
      nextClaimAt: '2026-09-26T15:00:00.000Z',
    })

    renderWithProviders(<DailyFreePanel />)

    await user.click(await screen.findByRole('button', { name: /claim free skin/i }))
    await user.click(await screen.findByRole('button', { name: /keep in inventory/i }))

    expect(getMockRouter().push).toHaveBeenCalledWith('/inventory')
  })
})
