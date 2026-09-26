import { screen } from '@testing-library/react'
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

import { getCases } from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'

const getCasesMock = vi.mocked(getCases)
const getBalanceMock = vi.mocked(getBalance)

describe('CasesShop', () => {
  beforeEach(() => {
    authService.logout()
    getCasesMock.mockReset()
    getBalanceMock.mockReset()
    getCasesMock.mockResolvedValue([{ id: 1, code: 'ANVIL', price: 50, sortOrder: 1 }])
  })

  it('lists cases as links to the case detail page', async () => {
    renderWithProviders(<CasesShop />)

    expect(await screen.findByRole('heading', { name: 'Anvil' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Anvil' })).toHaveAttribute('src', '/cases/ANVIL.webp')
    expect(screen.getByText('50.00 CD')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /anvil/i })).toHaveAttribute('href', '/cases/1')
  })
})
