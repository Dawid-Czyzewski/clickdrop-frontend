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
  collectIdle: vi.fn(),
}))

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { buyUpgrade, getBalance, getClickPower, getMyUpgrades } from '../../src/api/economyApi'
import { getCurrentUser } from '../../src/api/usersApi'
import { resetSharedCurrentUser } from '../../src/lib/currentUserStore'

const getBalanceMock = vi.mocked(getBalance)
const getClickPowerMock = vi.mocked(getClickPower)
const getMyUpgradesMock = vi.mocked(getMyUpgrades)
const buyUpgradeMock = vi.mocked(buyUpgrade)
const getCurrentUserMock = vi.mocked(getCurrentUser)

const mouse = {
  id: 1,
  code: 'BETTER_MOUSE',
  tier: 1,
  price: 50,
  clickPower: 1,
  level: 0,
  nextCost: 50,
  incomePerSecond: 0,
  minLevel: 1,
}

const gamingMouse = {
  id: 2,
  code: 'GAMING_MOUSE',
  tier: 2,
  price: 200,
  clickPower: 2,
  level: 0,
  nextCost: 200,
  incomePerSecond: 0,
  minLevel: 5,
}

const botFarm = {
  id: 6,
  code: 'BOT_FARM',
  tier: 6,
  price: 750,
  clickPower: 0,
  level: 2,
  nextCost: 750,
  incomePerSecond: 0.1,
  minLevel: 1,
}

describe('UpgradeShop', () => {
  beforeEach(() => {
    authService.logout()
    resetSharedCurrentUser()
    getBalanceMock.mockReset()
    getClickPowerMock.mockReset()
    getMyUpgradesMock.mockReset()
    buyUpgradeMock.mockReset()
    getCurrentUserMock.mockReset()
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 10,
      experience: 0,
      clickDollars: 100,
    })
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

  it('shows idle CD/s on idle cards and hides 0 CD/s on click upgrades', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 1000 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
    getMyUpgradesMock.mockResolvedValue([mouse, botFarm])

    renderWithProviders(<UpgradeShop />)

    expect(await screen.findByText('+0.10 CD/s')).toBeInTheDocument()
    expect(screen.queryByText('+0 CD/s')).not.toBeInTheDocument()
    expect(screen.queryByText(/your income/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bot Farm' })).toBeInTheDocument()
  })

  it('locks higher-tier buy below minLevel and unlocks after level-up', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 1000 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
    getMyUpgradesMock.mockResolvedValue([mouse, gamingMouse])
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 4,
      experience: 10,
      clickDollars: 1000,
    })
    buyUpgradeMock.mockResolvedValue({
      upgradeId: 2,
      code: 'GAMING_MOUSE',
      level: 1,
      balance: 800,
      cost: 200,
    })

    renderWithProviders(<UpgradeShop />)

    expect(await screen.findByRole('heading', { name: 'Gaming Mouse' })).toBeInTheDocument()
    expect(screen.getByText('Lvl 5+')).toBeInTheDocument()
    expect(screen.getByText(/requires lvl 5\+ to buy/i)).toBeInTheDocument()

    const buttons = screen.getAllByRole('button', { name: /upgrade/i })
    expect(buttons[0]).toBeEnabled()
    expect(buttons[1]).toBeDisabled()
    expect(buyUpgradeMock).not.toHaveBeenCalled()

    const { setSharedCurrentUser } = await import('../../src/lib/currentUserStore')
    setSharedCurrentUser({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 5,
      experience: 10,
      clickDollars: 1000,
    })

    await waitFor(() => {
      expect(screen.queryByText(/requires lvl 5\+ to buy/i)).not.toBeInTheDocument()
    })
    const unlocked = screen.getAllByRole('button', { name: /upgrade/i })
    expect(unlocked[1]).toBeEnabled()

    await user.click(unlocked[1])
    await waitFor(() => {
      expect(buyUpgradeMock).toHaveBeenCalledWith(2)
    })
  })

  it('shows 403 level-lock error from buy', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 1000 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
    getMyUpgradesMock.mockResolvedValue([mouse])
    const { ApiError } = await import('../../src/api/client')
    buyUpgradeMock.mockRejectedValue(
      new ApiError(403, 'Upgrade requires level 5, user has 1', {
        requiredLevel: '5',
        userLevel: '1',
      }),
    )

    renderWithProviders(<UpgradeShop />)

    await user.click(await screen.findByRole('button', { name: /upgrade/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /requires lvl 5\+ to buy this upgrade/i,
    )
  })
})
