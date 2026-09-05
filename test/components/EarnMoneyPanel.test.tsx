import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EarnMoneyPanel } from '../../src/components/home/EarnMoneyPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCurrentUser } from '../../src/api/usersApi'

const getCurrentUserMock = vi.mocked(getCurrentUser)

describe('EarnMoneyPanel', () => {
  it('shows guest state with login CTA', () => {
    renderWithProviders(<EarnMoneyPanel />)

    expect(screen.getByRole('heading', { name: /earn clickdollars/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in to earn/i })).toHaveAttribute('href', '/login')
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows user balance and earn button when logged in', async () => {
    authService.setSession({
      token: 'jwt-earn',
      refreshToken: 'refresh-earn',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 100,
      clickDollars: 42.25,
    })

    renderWithProviders(<EarnMoneyPanel />)

    await waitFor(() => {
      expect(screen.getByText('42.25')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /earn money/i })).toBeInTheDocument()
    expect(screen.getByText(/not connected yet/i)).toBeInTheDocument()
  })
})
