import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDailyFree } from '../../src/hooks/useDailyFree'
import i18n from '../utils/i18n'

vi.mock('../../src/api/dailyApi', () => ({
  getDailyStatus: vi.fn(),
  claimDaily: vi.fn(),
}))

vi.mock('../../src/api/casesApi', () => ({
  sellInventoryItem: vi.fn(),
}))

import { claimDaily, getDailyStatus } from '../../src/api/dailyApi'
import { sellInventoryItem } from '../../src/api/casesApi'

const getStatusMock = vi.mocked(getDailyStatus)
const claimMock = vi.mocked(claimDaily)
const sellMock = vi.mocked(sellInventoryItem)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const claimResult = {
  inventoryItemId: 9,
  itemCode: 'AK_REDLINE',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  nextClaimAt: '2026-09-26T15:00:00.000Z',
}

describe('useDailyFree', () => {
  beforeEach(() => {
    getStatusMock.mockReset()
    claimMock.mockReset()
    sellMock.mockReset()
  })

  it('loads status when enabled', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })

    const { result } = renderHook(() => useDailyFree(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.canClaim).toBe(true)
    expect(result.current.status?.available).toBe(true)
  })

  it('claims a drop and blocks until nextClaimAt', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue(claimResult)

    const { result } = renderHook(() => useDailyFree(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.canClaim).toBe(true)
    })

    await act(async () => {
      await result.current.claim()
    })

    expect(result.current.drop?.itemCode).toBe('AK_REDLINE')
    expect(result.current.status).toEqual({
      available: false,
      nextClaimAt: claimResult.nextClaimAt,
    })
    expect(result.current.canClaim).toBe(false)
  })

  it('sells the claimed drop', async () => {
    getStatusMock.mockResolvedValue({ available: true, nextClaimAt: null })
    claimMock.mockResolvedValue(claimResult)
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    const { result } = renderHook(() => useDailyFree(), { wrapper: HookProviders })

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
})
