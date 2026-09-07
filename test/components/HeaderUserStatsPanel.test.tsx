import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeaderUserStatsPanel } from '../../src/components/home/HeaderUserStatsPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '../../src/api/usersApi'

const getCurrentUserMock = vi.mocked(getCurrentUser)

describe('HeaderUserStatsPanel', () => {
  it('shows level and xp from backend without click dollars', async () => {
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

    renderWithProviders(<HeaderUserStatsPanel />)

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 8')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('XP 3200')).toBeInTheDocument()
    expect(screen.getByText('player')).toBeInTheDocument()
    expect(screen.queryByText('player@clickdrop.test')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/CD/i)).not.toBeInTheDocument()
  })

  it('shows loading state while fetching profile', () => {
    getCurrentUserMock.mockReturnValue(new Promise(() => undefined))

    renderWithProviders(<HeaderUserStatsPanel />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading stats…')
  })
})
