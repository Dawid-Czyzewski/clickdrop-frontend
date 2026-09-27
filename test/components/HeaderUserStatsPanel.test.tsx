import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeaderUserStatsPanel } from '../../src/components/home/HeaderUserStatsPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { getCurrentUser } from '../../src/api/usersApi'
import { getBalance } from '../../src/api/economyApi'

const getCurrentUserMock = vi.mocked(getCurrentUser)
const getBalanceMock = vi.mocked(getBalance)

describe('HeaderUserStatsPanel', () => {
  beforeEach(() => {
    authService.logout()
    getCurrentUserMock.mockReset()
    getBalanceMock.mockReset()
  })

  it('shows level, xp and ClickDollars balance', async () => {
    authService.setSession({
      token: 'jwt-header',
      refreshToken: 'refresh-header',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })

    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 8,
      experience: 3200,
      clickDollars: 42.25,
    })
    getBalanceMock.mockResolvedValue({ balance: 42.25 })

    renderWithProviders(<HeaderUserStatsPanel />)

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 8')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('XP 3200')).toBeInTheDocument()
    expect(await screen.findByLabelText('CD 42.25')).toBeInTheDocument()
    expect(screen.getByText('player')).toBeInTheDocument()
    expect(screen.queryByText('player@clickdrop.test')).not.toBeInTheDocument()
  })

  it('shows loading state while fetching profile', () => {
    getCurrentUserMock.mockReturnValue(new Promise(() => undefined))
    getBalanceMock.mockReturnValue(new Promise(() => undefined))

    renderWithProviders(<HeaderUserStatsPanel />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading stats…')
  })
})
