import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CaseDetailPanel } from '../../src/components/cases/CaseDetailPanel'
import { authService } from '../../src/auth/authService'
import { getMockRouter } from '../mocks/nextNavigation'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/casesApi', () => ({
  getCases: vi.fn(),
  getCaseDrops: vi.fn(),
  openCase: vi.fn(),
  getInventory: vi.fn(),
  sellInventoryItem: vi.fn(),
  sellInventoryBatch: vi.fn(),
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

import {
  getCaseDrops,
  getInventory,
  openCase,
  sellInventoryBatch,
  sellInventoryItem,
} from '../../src/api/casesApi'
import { getBalance } from '../../src/api/economyApi'
import { getCurrentUser } from '../../src/api/usersApi'
import { HeaderUserStatsPanel } from '../../src/components/home/HeaderUserStatsPanel'
import { LevelUpToast } from '../../src/components/home/LevelUpToast'

const getCaseDropsMock = vi.mocked(getCaseDrops)
const openCaseMock = vi.mocked(openCase)
const getInventoryMock = vi.mocked(getInventory)
const sellMock = vi.mocked(sellInventoryItem)
const sellBatchMock = vi.mocked(sellInventoryBatch)
const getBalanceMock = vi.mocked(getBalance)
const getCurrentUserMock = vi.mocked(getCurrentUser)

const anvil = {
  id: 1,
  code: 'REVOLUTION_CASE',
  displayName: 'Revolution Case',
  price: 50,
  sortOrder: 1,
}

const slateInventory = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

const slateDrop = {
  inventoryItemId: 9,
  itemCode: 'AK_47_SLATE',
  itemDisplayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
}

const slateOpen = {
  count: 1,
  totalCost: 50,
  balance: 50,
  drops: [slateDrop],
  experienceGained: 10,
  level: 4,
  experience: 460,
}

describe('CaseDetailPanel', () => {
  beforeEach(() => {
    authService.logout()
    getCaseDropsMock.mockReset()
    openCaseMock.mockReset()
    getInventoryMock.mockReset()
    sellMock.mockReset()
    sellBatchMock.mockReset()
    getBalanceMock.mockReset()
    getCurrentUserMock.mockReset()
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 1,
      experience: 0,
      clickDollars: 100,
    })
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    getCaseDropsMock.mockResolvedValue([
      {
        itemId: 1,
        code: 'GLOCK_18_UMBRAL_RABBIT',
        displayName: 'Glock-18 | Umbral Rabbit',
        rarity: 'MIL_SPEC',
        weight: 50,
        chancePercent: 50,
      },
      {
        itemId: 3,
        code: 'AK_47_SLATE',
        displayName: 'AK-47 | Slate',
        rarity: 'RESTRICTED',
        weight: 15,
        chancePercent: 15,
      },
      {
        itemId: 6,
        code: 'AK_47_ASIIMOV',
        displayName: 'AK-47 | Asiimov',
        rarity: 'COVERT',
        weight: 5,
        chancePercent: 5,
      },
      {
        itemId: 2,
        code: 'USP_S_PRINTSTREAM',
        displayName: 'USP-S | Printstream',
        rarity: 'MIL_SPEC',
        weight: 30,
        chancePercent: 30,
      },
    ])
    getInventoryMock.mockResolvedValue([])
  })

  it('shows drop chances for each skin', async () => {
    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    expect(await screen.findByText('Glock-18 | Umbral Rabbit')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Revolution Case' })).toHaveAttribute(
      'src',
      '/cases/REVOLUTION_CASE.webp',
    )
    expect(screen.getByRole('img', { name: 'Glock-18 | Umbral Rabbit' })).toHaveAttribute(
      'src',
      '/items/GLOCK_18_UMBRAL_RABBIT.webp',
    )
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('5%')).toBeInTheDocument()
  })

  it('opens a case, shows result, and keep goes to inventory', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await screen.findByRole('button', { name: /open ×1/i })
    await user.click(screen.getByRole('button', { name: /open ×1/i }))

    expect(await screen.findByRole('button', { name: /keep in inventory/i })).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveTextContent('Field-Tested')

    await user.click(screen.getByRole('button', { name: /keep in inventory/i }))

    expect(await screen.findByRole('dialog', { name: /lvl 4/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^continue$/i }))

    await waitFor(() => {
      expect(getMockRouter().push).toHaveBeenCalledWith('/inventory')
    })
  })

  it('opens a case and can sell the drop immediately', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await screen.findByRole('button', { name: /open ×1/i })
    await user.click(screen.getByRole('button', { name: /open ×1/i }))

    expect(await screen.findByRole('button', { name: /sell for 40.00 cd/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sell for 40.00 cd/i }))

    await waitFor(() => {
      expect(sellMock).toHaveBeenCalledWith(9)
      expect(screen.getByRole('status')).toHaveTextContent('+40.00 CD')
    })
    expect(await screen.findByRole('dialog', { name: /lvl 4/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('updates header level and XP after a successful open', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])

    renderWithProviders(
      <>
        <HeaderUserStatsPanel />
        <CaseDetailPanel gameCase={anvil} />
      </>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 3, 50 / 100 XP')).toBeInTheDocument()
    })

    await screen.findByRole('button', { name: /open ×1/i })
    await user.click(screen.getByRole('button', { name: /open ×1/i }))

    expect(await screen.findByText('+10 XP')).toBeInTheDocument()
    expect(screen.getByLabelText('Lvl 4, 60 / 100 XP')).toBeInTheDocument()
  })

  it('shows level-up modal after drop modal closes', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])

    renderWithProviders(
      <>
        <HeaderUserStatsPanel />
        <CaseDetailPanel gameCase={anvil} />
      </>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 3, 50 / 100 XP')).toBeInTheDocument()
    })

    await user.click(await screen.findByRole('button', { name: /open ×1/i }))

    expect(await screen.findByText('+10 XP')).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /lvl 4/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^close$/i }))

    expect(await screen.findByRole('dialog', { name: /lvl 4/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument()
  })

  it('does not show level-up toast while drop modal is open', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])

    renderWithProviders(
      <>
        <LevelUpToast />
        <HeaderUserStatsPanel />
        <CaseDetailPanel gameCase={anvil} />
      </>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 3, 50 / 100 XP')).toBeInTheDocument()
    })

    await user.click(await screen.findByRole('button', { name: /open ×1/i }))

    expect(await screen.findByText('+10 XP')).toBeInTheDocument()
    expect(screen.queryByText(/level up! lvl 4/i)).not.toBeInTheDocument()
  })

  it('does not show level-up modal when only XP increases', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue({
      ...slateOpen,
      experienceGained: 10,
      level: 3,
      experience: 460,
    })
    getInventoryMock.mockResolvedValueOnce([]).mockResolvedValueOnce([slateInventory])

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await user.click(await screen.findByRole('button', { name: /open ×1/i }))
    expect(await screen.findByText('+10 XP')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^close$/i }))

    expect(screen.queryByRole('dialog', { name: /lvl/i })).not.toBeInTheDocument()
  })

  it('locks ×5 for low level and does not suggest multi-open', async () => {
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 300 })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 1,
      experience: 0,
      clickDollars: 300,
    })

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    expect(
      await screen.findByRole('button', { name: /×5, from lvl 10/i }),
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: /×3, from lvl 5/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /open ×1/i })).toBeEnabled()
    expect(openCaseMock).not.toHaveBeenCalled()
  })

  it('blocks ×5 when balance is too low', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 10,
      experience: 0,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await user.click(await screen.findByRole('button', { name: /^×5$/i }))

    expect(screen.getByRole('button', { name: /open ×5/i })).toBeDisabled()
    expect(screen.getByText(/not enough clickdollars for ×5/i)).toBeInTheDocument()
    expect(openCaseMock).not.toHaveBeenCalled()
  })

  it('opens ×5, shows all drops, updates balance and inventory', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 10,
      experience: 0,
      clickDollars: 300,
    })
    getBalanceMock.mockResolvedValue({ balance: 300 })
    const multiDrops = Array.from({ length: 5 }, (_, index) => ({
      ...slateDrop,
      inventoryItemId: 20 + index,
      itemCode: index === 0 ? 'AK_47_SLATE' : `DROP_${index}`,
      itemDisplayName: index === 0 ? 'AK-47 | Slate' : `Drop ${index}`,
    }))
    openCaseMock.mockResolvedValue({
      count: 5,
      totalCost: 250,
      balance: 50,
      drops: multiDrops,
      experienceGained: 50,
      level: 10,
      experience: 50,
    })
    getInventoryMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(
        multiDrops.map((drop, index) => ({
          inventoryItemId: drop.inventoryItemId,
          itemId: index + 1,
          code: drop.itemCode,
          displayName: drop.itemDisplayName,
          rarity: drop.rarity,
          exterior: drop.exterior,
          suggestedSellPrice: drop.suggestedSellPrice,
          createdAt: '2026-01-01T00:00:00Z',
        })),
      )

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await user.click(await screen.findByRole('button', { name: /^×5$/i }))
    await user.click(screen.getByRole('button', { name: /open ×5/i }))

    expect(openCaseMock).toHaveBeenCalledWith(1, 5)
    const results = await screen.findByRole('dialog')
    expect(screen.getByRole('heading', { name: /your drops \(5\)/i })).toBeInTheDocument()
    expect(results).toHaveTextContent('AK-47 | Slate')
    expect(results).toHaveTextContent('Drop 1')
    expect(results).toHaveTextContent('+50 XP')
    expect(getInventoryMock).toHaveBeenCalledTimes(2)
  })

  it('shows open-count 403 message when multi-open is rejected', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 10,
      experience: 0,
      clickDollars: 300,
    })
    getBalanceMock.mockResolvedValue({ balance: 300 })
    const { ApiError } = await import('../../src/api/client')
    openCaseMock.mockRejectedValue(
      new ApiError(403, 'Case open ×5 requires level 10, user has 4', {
        requestedCount: '5',
        requiredLevel: '10',
        userLevel: '4',
      }),
    )

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await user.click(await screen.findByRole('button', { name: /^×5$/i }))
    await user.click(screen.getByRole('button', { name: /open ×5/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/×5 requires lvl 10\+/i)
  })

  it('does not change header XP when open is rate-limited', async () => {
    const user = userEvent.setup()
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getCurrentUserMock.mockResolvedValue({
      username: 'player',
      email: 'player@clickdrop.test',
      level: 3,
      experience: 450,
      clickDollars: 100,
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    const { ApiError } = await import('../../src/api/client')
    openCaseMock.mockRejectedValue(new ApiError(429, 'Too fast'))

    renderWithProviders(
      <>
        <HeaderUserStatsPanel />
        <CaseDetailPanel gameCase={anvil} />
      </>,
    )

    await waitFor(() => {
      expect(screen.getByLabelText('Lvl 3, 50 / 100 XP')).toBeInTheDocument()
    })

    await screen.findByRole('button', { name: /open ×1/i })
    await user.click(screen.getByRole('button', { name: /open ×1/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Lvl 3, 50 / 100 XP')).toBeInTheDocument()
  })

  it('disables open and shows lock reason when player level is too low', async () => {
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

    renderWithProviders(
      <CaseDetailPanel gameCase={{ ...anvil, minLevel: 5 }} />,
    )

    expect(await screen.findByText('Lvl 5+')).toBeInTheDocument()
    expect(await screen.findByText(/requires lvl 5\+ to open/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open ×1/i })).toBeDisabled()
    expect(openCaseMock).not.toHaveBeenCalled()
  })

  it('enables open when player meets minLevel', async () => {
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
      level: 5,
      experience: 10,
      clickDollars: 100,
    })
    openCaseMock.mockResolvedValue(slateOpen)

    renderWithProviders(
      <CaseDetailPanel gameCase={{ ...anvil, minLevel: 5 }} />,
    )

    expect(await screen.findByText('Lvl 5+')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /open ×1/i })).toBeEnabled()
    })
    expect(screen.queryByText(/requires lvl 5\+ to open/i)).not.toBeInTheDocument()
  })

  it('skip animation toggle shows result without spinner when motion is allowed', async () => {
    const user = userEvent.setup()
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    authService.setSession({
      token: 'jwt',
      refreshToken: 'refresh',
      id: 1,
      email: 'player@clickdrop.test',
      role: 'USER',
    })
    getBalanceMock.mockResolvedValue({ balance: 100 })
    openCaseMock.mockResolvedValue(slateOpen)

    renderWithProviders(<CaseDetailPanel gameCase={anvil} />)

    await user.click(await screen.findByRole('checkbox', { name: /skip animation/i }))
    await user.click(screen.getByRole('button', { name: /open ×1/i }))

    expect(screen.queryByText(/opening case/i)).not.toBeInTheDocument()
    expect(await screen.findByRole('dialog')).toHaveTextContent('AK-47 | Slate')
  })
})
