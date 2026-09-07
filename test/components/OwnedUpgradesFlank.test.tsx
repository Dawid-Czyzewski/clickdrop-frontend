import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EarnMoneyPanel } from '../../src/components/home/EarnMoneyPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getBalance, getMyUpgrades } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)
const getMyUpgradesMock = vi.mocked(getMyUpgrades)

describe('EarnMoneyPanel owned upgrades', () => {
  beforeEach(() => {
    authService.logout()
    getBalanceMock.mockReset()
    getMyUpgradesMock.mockReset()
  })

  it('shows owned upgrades around the click button using i18n names', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 20 })
    getMyUpgradesMock.mockResolvedValue([
      {
        id: 1,
        code: 'BETTER_MOUSE',
        tier: 1,
        price: 50,
        clickPower: 1,
        level: 2,
        nextCost: 50,
      },
      {
        id: 2,
        code: 'GAMING_MOUSE',
        tier: 2,
        price: 200,
        clickPower: 2,
        level: 1,
        nextCost: 200,
      },
    ])

    renderWithProviders(<EarnMoneyPanel />)

    await waitFor(() => {
      expect(screen.getByText('Better Mouse')).toBeInTheDocument()
      expect(screen.getByText('Gaming Mouse')).toBeInTheDocument()
    })

    // Better Mouse lvl2×1=2, Gaming Mouse lvl1×2=2; chips + total (base 1 → 5)
    expect(screen.getAllByText('+2 / click')).toHaveLength(2)
    expect(screen.getByText('+5 / click')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /click to earn/i })).toBeInTheDocument()
  })
})
