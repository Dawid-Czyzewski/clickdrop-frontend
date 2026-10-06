import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EarnMoneyPanel } from '../../src/components/home/EarnMoneyPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
  collectIdle: vi.fn(),
  getIdleStatus: vi.fn(),
}))

import { getBalance, getClickPower, getIdleStatus, getMyUpgrades } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)
const getClickPowerMock = vi.mocked(getClickPower)
const getMyUpgradesMock = vi.mocked(getMyUpgrades)
const getIdleStatusMock = vi.mocked(getIdleStatus)

describe('EarnMoneyPanel owned upgrades', () => {
  beforeEach(() => {
    authService.logout()
    getBalanceMock.mockReset()
    getClickPowerMock.mockReset()
    getMyUpgradesMock.mockReset()
    getIdleStatusMock.mockReset()
    getIdleStatusMock.mockResolvedValue({
      pending: 0,
      incomePerSecond: 0,
      lastIdleCollectedAt: new Date().toISOString(),
    })
  })

  it('shows owned upgrades and rewardPerClick from API', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 20 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 5 })
    getMyUpgradesMock.mockResolvedValue([
      {
        id: 1,
        code: 'BETTER_MOUSE',
        tier: 1,
        price: 50,
        clickPower: 1,
        level: 2,
        nextCost: 50,
        incomePerSecond: 0,
      },
      {
        id: 2,
        code: 'GAMING_MOUSE',
        tier: 2,
        price: 200,
        clickPower: 2,
        level: 1,
        nextCost: 200,
        incomePerSecond: 0,
      },
    ])

    renderWithProviders(<EarnMoneyPanel />)

    await waitFor(() => {
      expect(screen.getByText('Better Mouse')).toBeInTheDocument()
      expect(screen.getByText('Gaming Mouse')).toBeInTheDocument()
    })

    expect(screen.getAllByText('+2 / click')).toHaveLength(2)
    expect(screen.getByText('+5 / click')).toBeInTheDocument()
    expect(getClickPowerMock).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /click to earn/i })).toBeInTheDocument()
  })

  it('shows CD/s on owned idle upgrades instead of +0 / click', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 20 })
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
    getMyUpgradesMock.mockResolvedValue([
      {
        id: 6,
        code: 'BOT_FARM',
        tier: 6,
        price: 750,
        clickPower: 0,
        level: 1,
        nextCost: 750,
        incomePerSecond: 0.1,
      },
    ])

    renderWithProviders(<EarnMoneyPanel />)

    expect(await screen.findByText('Bot Farm')).toBeInTheDocument()
    expect(screen.getByText('+0.10 CD/s')).toBeInTheDocument()
    expect(screen.queryByText('+0 / click')).not.toBeInTheDocument()
  })
})
