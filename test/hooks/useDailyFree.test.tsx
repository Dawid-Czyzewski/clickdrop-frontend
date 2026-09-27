import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDailyFree } from '../../src/hooks/useDailyFree'
import i18n from '../utils/i18n'

vi.mock('../../src/api/dailyApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/api/dailyApi')>()
  return {
    ...actual,
    getDailyStatus: vi.fn(),
    getDailyDrops: vi.fn(),
    claimDaily: vi.fn(),
  }
})

vi.mock('../../src/api/casesApi', () => ({
  sellInventoryItem: vi.fn(),
}))

import { claimDaily, getDailyDrops, getDailyStatus } from '../../src/api/dailyApi'
import { sellInventoryItem } from '../../src/api/casesApi'

const getStatusMock = vi.mocked(getDailyStatus)
const getDropsMock = vi.mocked(getDailyDrops)
const claimMock = vi.mocked(claimDaily)
const sellMock = vi.mocked(sellInventoryItem)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const skinDrops = [
  {
    type: 'SKIN' as const,
    itemId: 3,
    itemCode: 'AK_47_SLATE',
    itemDisplayName: 'AK-47 | Slate',
    rarity: 'RESTRICTED' as const,
    weight: 10,
  },
  { type: 'CASH' as const, cashAmount: 5, weight: 40 },
]

const skinClaim = {
  type: 'SKIN' as const,
  inventoryItemId: 9,
  itemCode: 'AK_47_SLATE',
  itemDisplayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  nextClaimAt: '2027-09-26T15:00:00.000Z',
}

const cashClaim = {
  type: 'CASH' as const,
  cashAmount: 12.5,
  balance: 62.5,
  nextClaimAt: '2027-09-26T15:00:00.000Z',
}

describe('useDailyFree', () => {
  beforeEach(() => {
    getStatusMock.mockReset()
    getDropsMock.mockReset()
    claimMock.mockReset()
    sellMock.mockReset()
    getDropsMock.mockResolvedValue(skinDrops)
  })

  it('loads drops for guests without status', async () => {
    const { result } = renderHook(() => useDailyFree({ loggedIn: false }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(getDropsMock).toHaveBeenCalled()
    expect(getStatusMock).not.toHaveBeenCalled()
    expect(result.current.drops).toHaveLength(2)
    expect(result.current.canClaim).toBe(false)
  })

  it('loads status when logged in', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })

    const { result } = renderHook(() => useDailyFree({ loggedIn: true }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.canClaim).toBe(true)
    expect(result.current.status?.available).toBe(true)
  })

  it('claims a skin and blocks until nextClaimAt', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue(skinClaim)

    const { result } = renderHook(() => useDailyFree({ loggedIn: true }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.canClaim).toBe(true)
    })

    await act(async () => {
      await result.current.claim()
    })

    expect(result.current.drop).toEqual(skinClaim)
    expect(result.current.status).toEqual({
      available: false,
      nextClaimAt: skinClaim.nextClaimAt,
    })
    expect(result.current.canClaim).toBe(false)
  })

  it('claims cash without inventory sell', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue(cashClaim)

    const { result } = renderHook(() => useDailyFree({ loggedIn: true }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.canClaim).toBe(true)
    })

    await act(async () => {
      await result.current.claim()
    })

    expect(result.current.drop).toEqual(cashClaim)
    const sold = await act(async () => result.current.sellDrop())
    expect(sold).toBeNull()
    expect(sellMock).not.toHaveBeenCalled()
  })

  it('sells a claimed skin drop', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue(skinClaim)
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    const { result } = renderHook(() => useDailyFree({ loggedIn: true }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.canClaim).toBe(true)
    })

    await act(async () => {
      await result.current.claim()
    })

    const balance = await act(async () => result.current.sellDrop())

    expect(balance).toBe(90)
    expect(sellMock).toHaveBeenCalledWith(9)
    expect(result.current.drop).toBeNull()
  })

  it('exposes remainingMs when locked', async () => {
    const next = new Date(Date.now() + 90 * 60 * 1000).toISOString()
    getStatusMock.mockResolvedValue({ available: false, nextClaimAt: next })

    const { result } = renderHook(() => useDailyFree({ loggedIn: true }), {
      wrapper: HookProviders,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.canClaim).toBe(false)
    expect(result.current.remainingMs).toBeGreaterThan(0)
  })
})
