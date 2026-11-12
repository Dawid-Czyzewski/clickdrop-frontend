import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CollectionDetailPanel } from '../../src/components/collections/CollectionDetailPanel'
import { CollectionsPanel } from '../../src/components/collections/CollectionsPanel'
import { authService } from '../../src/auth/authService'
import { renderWithProviders } from '../utils/render'

vi.mock('../../src/api/collectionsApi', () => ({
  getCollections: vi.fn(),
  getCollection: vi.fn(),
  claimCollection: vi.fn(),
}))

vi.mock('../../src/api/economyApi', () => ({
  getBalance: vi.fn(),
  getClickPower: vi.fn(),
  clickToEarn: vi.fn(),
  getMyUpgrades: vi.fn(),
  buyUpgrade: vi.fn(),
}))

import { claimCollection, getCollection, getCollections } from '../../src/api/collectionsApi'
import { getBalance } from '../../src/api/economyApi'

const getCollectionsMock = vi.mocked(getCollections)
const getCollectionMock = vi.mocked(getCollection)
const claimMock = vi.mocked(claimCollection)
const getBalanceMock = vi.mocked(getBalance)

function login() {
  authService.setSession({
    token: 'jwt',
    refreshToken: 'refresh',
    id: 1,
    email: 'player@clickdrop.test',
    role: 'USER',
  })
  getBalanceMock.mockResolvedValue({ balance: 50 })
}

const incompleteDetail = {
  code: 'CS20_CASE',
  displayName: 'CS20 Case',
  sortOrder: 1,
  owned: 1,
  total: 2,
  completed: false,
  rewardCd: 850,
  rewardClaimed: false,
  items: [
    {
      itemId: 1,
      code: 'USP_A',
      displayName: 'USP A',
      rarity: 'MIL_SPEC' as const,
      owned: true,
    },
    {
      itemId: 2,
      code: 'AK_B',
      displayName: 'AK B',
      rarity: 'RESTRICTED' as const,
      owned: false,
    },
  ],
}

const completeDetail = {
  ...incompleteDetail,
  owned: 2,
  completed: true,
  items: incompleteDetail.items.map((item) => ({ ...item, owned: true })),
}

describe('Collections UI', () => {
  beforeEach(() => {
    authService.logout()
    getCollectionsMock.mockReset()
    getCollectionMock.mockReset()
    claimMock.mockReset()
    getBalanceMock.mockReset()
  })

  it('lists collections with progress', async () => {
    login()
    getCollectionsMock.mockResolvedValue([
      {
        code: 'CS20_CASE',
        displayName: 'CS20 Case',
        sortOrder: 1,
        owned: 0,
        total: 17,
        completed: false,
        rewardCd: 850,
        rewardClaimed: false,
      },
    ])

    renderWithProviders(<CollectionsPanel />)

    expect(await screen.findByRole('heading', { name: /collections/i })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /cs20 case/i })).toHaveAttribute(
      'href',
      '/collections/CS20_CASE',
    )
    expect(screen.getByText(/0 \/ 17/i)).toBeInTheDocument()
  })

  it('keeps claim locked when collection is incomplete', async () => {
    login()
    getCollectionMock.mockResolvedValue(incompleteDetail)

    renderWithProviders(<CollectionDetailPanel code="CS20_CASE" />)

    expect(await screen.findByRole('button', { name: /claim bonus/i })).toBeDisabled()
    expect(screen.getByText(/missing/i)).toBeInTheDocument()
  })

  it('claims bonus on happy path and shows toast', async () => {
    login()
    getCollectionMock.mockResolvedValue(completeDetail)
    claimMock.mockResolvedValue({ code: 'CS20_CASE', rewardCd: 850, balance: 900 })

    const user = userEvent.setup()
    renderWithProviders(<CollectionDetailPanel code="CS20_CASE" />)

    const claimBtn = await screen.findByRole('button', { name: /claim bonus/i })
    expect(claimBtn).toBeEnabled()
    await user.click(claimBtn)

    await waitFor(() => {
      expect(claimMock).toHaveBeenCalledWith('CS20_CASE')
    })
    expect(await screen.findByText(/\+850(?:\.00)? CD claimed/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /claimed/i })).toBeDisabled()
  })
})
