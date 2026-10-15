import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LeaderboardPanel } from '../../src/components/leaderboard/LeaderboardPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getLeaderboard: vi.fn(),
  getCurrentUser: vi.fn(),
}))

import { getLeaderboard } from '../../src/api/usersApi'

const getLeaderboardMock = vi.mocked(getLeaderboard)

describe('LeaderboardPanel', () => {
  beforeEach(() => {
    authService.logout()
    getLeaderboardMock.mockReset()
  })

  it('loads ranking for guests', async () => {
    getLeaderboardMock.mockResolvedValue([
      { rank: 1, username: 'ace', level: 12, experience: 340 },
      { rank: 2, username: 'bravo', level: 10, experience: 80 },
    ])

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByRole('heading', { name: /leaderboard/i })).toBeInTheDocument()
    expect(await screen.findByText('ace')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('bravo')).toBeInTheDocument()
    expect(getLeaderboardMock).toHaveBeenCalled()
  })

  it('shows empty state', async () => {
    getLeaderboardMock.mockResolvedValue([])

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByText(/no players on the board yet/i)).toBeInTheDocument()
  })

  it('shows error state', async () => {
    getLeaderboardMock.mockRejectedValue(new Error('boom'))

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /could not load the leaderboard/i,
    )
  })
})
