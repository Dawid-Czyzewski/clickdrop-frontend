import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../src/api/client'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '../../src/api/usersApi'

const getCurrentUserMock = vi.mocked(getCurrentUser)

const profile = {
  username: 'playerone',
  email: 'player@clickdrop.test',
  level: 7,
  experience: 2450,
  clickDollars: 150.75,
}

describe('DashboardPage', () => {
  it('shows loading state while fetching profile', () => {
    getCurrentUserMock.mockReturnValue(new Promise(() => undefined))

    renderWithProviders(<DashboardPage />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading your profile…')
  })

  it('renders profile data from backend', async () => {
    getCurrentUserMock.mockResolvedValue(profile)

    renderWithProviders(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByText('playerone')).toBeInTheDocument()
    })

    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('2450')).toBeInTheDocument()
    expect(screen.getByText('150.75')).toBeInTheDocument()
  })

  it('shows error when profile request fails', async () => {
    getCurrentUserMock.mockRejectedValue(new ApiError(500, 'Server error'))

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The server is unavailable. Please try again later.',
    )
  })
})
