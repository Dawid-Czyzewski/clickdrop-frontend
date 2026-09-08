import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EarnMoneyPanel } from '../../src/components/home/EarnMoneyPanel'
import { ApiError } from '../../src/api/client'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { clickToEarn, getBalance, getClickPower, getMyUpgrades } from '../../src/api/economyApi'

const getBalanceMock = vi.mocked(getBalance)
const getClickPowerMock = vi.mocked(getClickPower)
const clickToEarnMock = vi.mocked(clickToEarn)
const getMyUpgradesMock = vi.mocked(getMyUpgrades)

function setLoggedInSession() {
  authService.setSession({
    token: 'jwt-earn',
    refreshToken: 'refresh-earn',
    id: 1,
    email: 'player@clickdrop.test',
    role: 'USER',
  })
}

describe('EarnMoneyPanel', () => {
  beforeEach(() => {
    authService.logout()
    getBalanceMock.mockReset()
    getClickPowerMock.mockReset()
    clickToEarnMock.mockReset()
    getMyUpgradesMock.mockReset()
    getMyUpgradesMock.mockResolvedValue([])
    getClickPowerMock.mockResolvedValue({ rewardPerClick: 1 })
  })

  it('shows guest state with login CTA', () => {
    renderWithProviders(<EarnMoneyPanel />)

    expect(screen.getByRole('heading', { name: /earn clickdollars/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in to earn/i })).toHaveAttribute('href', '/login')
    expect(screen.getByText('— ClickDollars')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /click to earn/i })).not.toBeInTheDocument()
    expect(getBalanceMock).not.toHaveBeenCalled()
  })

  it('shows ClickButton and balance when logged in', async () => {
    setLoggedInSession()
    getBalanceMock.mockResolvedValue({ balance: 0 })

    renderWithProviders(<EarnMoneyPanel />)

    await waitFor(() => {
      expect(screen.getByText('0.00 ClickDollars')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /click to earn/i })).toBeInTheDocument()
  })

  it('shows error when balance request fails', async () => {
    setLoggedInSession()
    getBalanceMock.mockRejectedValue(new ApiError(500, 'down'))

    renderWithProviders(<EarnMoneyPanel />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The economy service is unavailable. Please try again later.',
    )
  })

  it('posts click, updates balance, and disables button while pending', async () => {
    const user = userEvent.setup()
    setLoggedInSession()
    getBalanceMock.mockResolvedValue({ balance: 14 })

    let resolveClick!: (value: { balance: number; earned: number }) => void
    clickToEarnMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveClick = resolve
        }),
    )

    renderWithProviders(<EarnMoneyPanel />)

    const button = await screen.findByRole('button', { name: /click to earn/i })
    await waitFor(() => {
      expect(screen.getByText('14.00 ClickDollars')).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    await user.click(button)

    await waitFor(() => {
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
    expect(clickToEarnMock).toHaveBeenCalledTimes(1)

    resolveClick({ balance: 15, earned: 1 })

    await waitFor(() => {
      expect(screen.getByText('15.00 ClickDollars')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('+1 ClickDollar')
      expect(button).toBeEnabled()
    })
  })

  it('increments balance across multiple clicks from backend responses', async () => {
    const user = userEvent.setup()
    setLoggedInSession()
    getBalanceMock.mockResolvedValue({ balance: 0 })
    clickToEarnMock.mockImplementation(async () => {
      const nextBalance = clickToEarnMock.mock.calls.length
      return { balance: nextBalance, earned: 1 }
    })

    renderWithProviders(<EarnMoneyPanel />)

    const button = await screen.findByRole('button', { name: /click to earn/i })
    await screen.findByText('0.00 ClickDollars')

    await user.click(button)
    await waitFor(() => {
      expect(screen.getByText('1.00 ClickDollars')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('+1 ClickDollar')
      expect(button).toBeEnabled()
    })

    await user.click(button)
    await waitFor(() => {
      expect(screen.getByText('2.00 ClickDollars')).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    expect(clickToEarnMock).toHaveBeenCalledTimes(2)
    expect(screen.getAllByText('+1 ClickDollar').length).toBeGreaterThanOrEqual(2)
  })

  it('keeps balance visible when click fails', async () => {
    const user = userEvent.setup()
    setLoggedInSession()
    getBalanceMock.mockResolvedValue({ balance: 14 })
    clickToEarnMock.mockRejectedValue(new ApiError(500, 'down'))

    renderWithProviders(<EarnMoneyPanel />)

    await screen.findByText('14.00 ClickDollars')
    await user.click(screen.getByRole('button', { name: /click to earn/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The economy service is unavailable. Please try again later.',
    )
    expect(screen.getByText('14.00 ClickDollars')).toBeInTheDocument()
  })
})
