import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpgradeShop } from '../../src/components/upgrades/UpgradeShop'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
  clickToEarn: vi.fn(),
}))

import { buyUpgrade, getBalance, getClickPower, getMyUpgrades } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)
const getClickPowerMock = vi.mocked(getClickPower)
const getMyUpgradesMock = vi.mocked(getMyUpgrades)
const buyUpgradeMock = vi.mocked(buyUpgrade)

const mouse = {
  id: 1,
  code: 'BETTER_MOUSE',
  tier: 1,
  price: 50,
  clickPower: 1,
  level: 0,
  nextCost: 50,
}

describe('UpgradeShop', () => {
  beforeEach(() => {
    authService.logout()
    getBalanceMock.mockReset()
    getClickPowerMock.mockReset()
    getMyUpgradesMock.mockReset()
    buyUpgradeMock.mockReset()
  })

  it('shows login CTA for guests', () => {
    renderWithProviders(<UpgradeShop />)

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    expect(getMyUpgradesMock).not.toHaveBeenCalled()
  })

  it('renders upgrades, shows API click power, and refreshes it after buy', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    getClickPowerMock
      .mockResolvedValueOnce({ rewardPerClick: 1 })
      .mockResolvedValueOnce({ rewardPerClick: 2 })
    getMyUpgradesMock
      .mockResolvedValueOnce([mouse])
      .mockResolvedValueOnce([{ ...mouse, level: 1 }])
    buyUpgradeMock.mockResolvedValue({
      upgradeId: 1,
      code: 'BETTER_MOUSE',
      level: 1,
      balance: 50,
      cost: 50,
    })

    renderWithProviders(<UpgradeShop />)

    expect(await screen.findByRole('heading', { name: 'Better Mouse' })).toBeInTheDocument()
    expect(screen.getAllByText('+1 / click').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('+1 click power per level')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /upgrade/i }))

    await waitFor(() => {
      expect(buyUpgradeMock).toHaveBeenCalledWith(1)
      expect(screen.getByText('50.00 ClickDollars')).toBeInTheDocument()
      expect(screen.getByText('Level 1')).toBeInTheDocument()
      expect(screen.getByText('+2 / click')).toBeInTheDocument()
    })

    expect(getClickPowerMock).toHaveBeenCalledTimes(2)
  })

  it('disables buy when balance is too low', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 10 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
    getMyUpgradesMock.mockResolvedValue([mouse])

    renderWithProviders(<UpgradeShop />)

    const button = await screen.findByRole('button', { name: /upgrade/i })
    expect(button).toBeDisabled()
    expect(screen.getAllByText('Not enough ClickDollars').length).toBeGreaterThan(0)
  })
})
