import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CasesShop } from '../../src/components/cases/CasesShop'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getCases: vi.fn(),
  getCaseDrops: vi.fn(),
  openCase: vi.fn(),
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

vi.mock('../../src/api/usersApi', () => ({
  getCurrentUser: vi.fn(),
}))

import { getCases } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'
import { getCurrentUser } from '../../src/api/usersApi'

const getCasesMock = vi.mocked(getCases)
const getBalanceMock = vi.mocked(getBalance)
const getCurrentUserMock = vi.mocked(getCurrentUser)

describe('CasesShop', () => {
  beforeEach(() => {
    authService.logout()
    getCasesMock.mockReset()
    getBalanceMock.mockReset()
    getCurrentUserMock.mockReset()
    getCasesMock.mockResolvedValue([
      { id: 1, code: 'REVOLUTION_CASE', displayName: 'Revolution Case', price: 50, sortOrder: 1 },
    ])
  })

  it('lists cases as links to the case detail page', async () => {
    renderWithProviders(<CasesShop />)

    expect(await screen.findByRole('heading', { name: 'Revolution Case' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Revolution Case' })).toHaveAttribute('src', '/cases/REVOLUTION_CASE.webp')
    expect(screen.getByText('50.00')).toBeInTheDocument()
    expect(screen.getByText('Lvl 1+')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /revolution case/i })).toHaveAttribute('href', '/cases/1')
  })

  it('lists cases ordered by minLevel ascending', async () => {
    getCasesMock.mockResolvedValue([
      {
        id: 3,
        code: 'CS20_CASE',
        displayName: 'CS20 Case',
        price: 80,
        sortOrder: 1,
        minLevel: 5,
      },
      {
        id: 1,
        code: 'REVOLUTION_CASE',
        displayName: 'Revolution Case',
        price: 50,
        sortOrder: 2,
        minLevel: 1,
      },
      {
        id: 2,
        code: 'CLUTCH_CASE',
        displayName: 'Clutch Case',
        price: 60,
        sortOrder: 1,
        minLevel: 3,
      },
    ])

    renderWithProviders(<CasesShop />)

    const headings = await screen.findAllByRole('heading', { level: 3 })
    expect(headings.map((el) => el.textContent)).toEqual([
      'Revolution Case',
      'Clutch Case',
      'CS20 Case',
    ])
  })

  it('shows retry and home when cases list is empty', async () => {
    const user = userEvent.setup()
    getCasesMock.mockResolvedValueOnce([]).mockResolvedValueOnce([
      { id: 1, code: 'REVOLUTION_CASE', displayName: 'Revolution Case', price: 50, sortOrder: 1 },
    ])

    renderWithProviders(<CasesShop />)

    expect(await screen.findByText(/no cases available yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(await screen.findByRole('heading', { name: 'Revolution Case' })).toBeInTheDocument()
    expect(getCasesMock).toHaveBeenCalledTimes(2)
  })

  it('shows retry and home on cases load error', async () => {
    getCasesMock.mockRejectedValue(new Error('boom'))

    renderWithProviders(<CasesShop />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
    await waitFor(() => {
      expect(getCasesMock).toHaveBeenCalled()
    })
  })

  it('shows level badge for gated cases and marks locked for underleveled players', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 2,
      experience: 10,
      clickDollars: 100,
    })
    getCasesMock.mockResolvedValue([
      {
        id: 2,
        code: 'REVOLUTION_CASE',
        displayName: 'Revolution Case',
        price: 50,
        sortOrder: 1,
        minLevel: 5,
      },
    ])

    renderWithProviders(<CasesShop />)

    expect(await screen.findByText('Lvl 5+')).toBeInTheDocument()
  })
})
