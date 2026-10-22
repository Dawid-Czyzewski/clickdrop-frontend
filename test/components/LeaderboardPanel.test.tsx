import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LeaderboardPanel } from '../../src/components/leaderboard/LeaderboardPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getLeaderboard: vi.fn(),
  getCurrentUser: vi.fn(),
  getMyLeaderboardRank: vi.fn(),
}))

import { getLeaderboard, getMyLeaderboardRank } from '../../src/api/usersApi'

const getLeaderboardMock = vi.mocked(getLeaderboard)
const getMyRankMock = vi.mocked(getMyLeaderboardRank)

describe('LeaderboardPanel', () => {
  beforeEach(() => {
    authService.logout()
    getLeaderboardMock.mockReset()
    getMyRankMock.mockReset()
  })

  it('loads ranking for guests with login CTA and no You bar', async () => {
    getLeaderboardMock.mockResolvedValue([
      { rank: 1, username: 'ace', level: 12, experience: 340 },
      { rank: 2, username: 'bravo', level: 10, experience: 80 },
    ])

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByRole('heading', { name: /leaderboard/i })).toBeInTheDocument()
    expect(await screen.findByText('ace')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('bravo')).toBeInTheDocument()
    expect(screen.getByText(/sign in to see your rank/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
    expect(screen.queryByLabelText(/your rank/i)).not.toBeInTheDocument()
    expect(getLeaderboardMock).toHaveBeenCalled()
    expect(getMyRankMock).not.toHaveBeenCalled()
  })

  it('shows sticky You rank and highlights own top row when logged in', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getLeaderboardMock.mockResolvedValue([
      { rank: 1, username: 'ace', level: 12, experience: 340 },
      { rank: 2, username: 'player', level: 7, experience: 210 },
      { rank: 3, username: 'bravo', level: 6, experience: 50 },
    ])
    getMyRankMock.mockResolvedValue({
      rank: 2,
      username: 'player',
      level: 7,
      experience: 210,
    })

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByLabelText(/your rank/i)).toHaveTextContent(
      /you · #2 · lvl 7 · 210 xp/i,
    )
    expect(getMyRankMock).toHaveBeenCalled()

    const selfRow = screen.getByText('player').closest('li')
    expect(selfRow).toHaveAttribute('aria-current', 'true')
    expect(selfRow).toHaveTextContent(/you/i)
  })

  it('shows You bar even when rank is outside top list', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getLeaderboardMock.mockResolvedValue([
      { rank: 1, username: 'ace', level: 12, experience: 340 },
    ])
    getMyRankMock.mockResolvedValue({
      rank: 42,
      username: 'player',
      level: 3,
      experience: 40,
    })

    renderWithProviders(<LeaderboardPanel />)

    expect(await screen.findByLabelText(/your rank/i)).toHaveTextContent(
      /you · #42 · lvl 3 · 40 xp/i,
    )
    expect(screen.queryByText('player')).not.toBeInTheDocument()
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
