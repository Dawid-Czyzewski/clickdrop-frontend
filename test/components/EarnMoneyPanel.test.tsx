import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EarnMoneyPanel } from '../../src/components/home/EarnMoneyPanel'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
}))

import { getBalance } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)

describe('EarnMoneyPanel', () => {
  it('shows guest state with login CTA', () => {
    renderWithProviders(<EarnMoneyPanel />)

    expect(screen.getByRole('heading', { name: /earn clickdollars/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in to earn/i })).toHaveAttribute('href', '/login')
    expect(screen.getByText('— ClickDollars')).toBeInTheDocument()
    expect(getBalanceMock).not.toHaveBeenCalled()
  })

  it('loads balance from economy API when logged in', async () => {
    authService.setSession({
      token: 'jwt-earn',
      refreshToken: 'refresh-earn',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 0 })

    renderWithProviders(<EarnMoneyPanel />)

    await waitFor(() => {
      expect(screen.getByText('0.00 ClickDollars')).toBeInTheDocument()
    })

    expect(getBalanceMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /earn money/i })).toBeInTheDocument()
  })

  it('shows error when balance request fails', async () => {
    authService.setSession({
      token: 'jwt-earn',
      refreshToken: 'refresh-earn',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockRejectedValue(new ApiError(500, 'down'))

    renderWithProviders(<EarnMoneyPanel />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The economy service is unavailable. Please try again later.',
    )
  })
})
