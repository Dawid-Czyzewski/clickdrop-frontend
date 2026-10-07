import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OpenCaseResponse } from '../../src/api/casesApi'
import { useInventory } from '../../src/hooks/useInventory'
import i18n from '../utils/i18n'

vi.mock('../../src/api/casesApi', () => ({
  getInventory: vi.fn(),
  openCase: vi.fn(),
  sellInventoryItem: vi.fn(),
  sellInventoryBatch: vi.fn(),
}))

import { getInventory, openCase, sellInventoryBatch, sellInventoryItem } from '../../src/api/casesApi'

const getInventoryMock = vi.mocked(getInventory)
const openCaseMock = vi.mocked(openCase)
const sellMock = vi.mocked(sellInventoryItem)
const sellBatchMock = vi.mocked(sellInventoryBatch)

function HookProviders({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const drop: OpenCaseResponse = {
  inventoryItemId: 9,
  itemCode: 'AK_47_SLATE',
  itemDisplayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED',
  exterior: 'FIELD_TESTED',
  balance: 50,
  cost: 50,
  suggestedSellPrice: 40,
}

const inventoryItem = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED' as const,
  exterior: 'FIELD_TESTED' as const,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

describe('useInventory', () => {
  beforeEach(() => {
    getInventoryMock.mockReset()
    openCaseMock.mockReset()
    sellMock.mockReset()
    sellBatchMock.mockReset()
  })

  it('openCase refreshes inventory with the dropped item', async () => {
    getInventoryMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([inventoryItem])
    openCaseMock.mockResolvedValue(drop)

    const { result } = renderHook(() => useInventory(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const opened = await act(async () => result.current.openCase(1))

    expect(opened?.itemCode).toBe('AK_47_SLATE')
    expect(result.current.items).toEqual([inventoryItem])
    expect(openCaseMock).toHaveBeenCalledWith(1)
  })

  it('sellItem removes the item and returns sold amount', async () => {
    getInventoryMock.mockResolvedValue([inventoryItem])
    sellMock.mockResolvedValue({ balance: 90, soldFor: 40 })

    const { result } = renderHook(() => useInventory(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1)
    })

    const sold = await act(async () => result.current.sellItem(9))

    expect(sold).toEqual({ balance: 90, soldFor: 40 })
    expect(result.current.items).toEqual([])
  })

  it('sellBatch removes sold items and returns totalEarned', async () => {
    const second = { ...inventoryItem, inventoryItemId: 10, code: 'GLOCK_18_UMBRAL_RABBIT' }
    getInventoryMock.mockResolvedValue([inventoryItem, second])
    sellBatchMock.mockResolvedValue({
      soldCount: 2,
      totalEarned: 60,
      balance: 110,
      sold: [
        { inventoryItemId: 9, itemCode: 'AK_47_SLATE', earned: 40 },
        { inventoryItemId: 10, itemCode: 'GLOCK_18_UMBRAL_RABBIT', earned: 20 },
      ],
      skipped: [],
    })

    const { result } = renderHook(() => useInventory(), { wrapper: HookProviders })

    await waitFor(() => {
      expect(result.current.items).toHaveLength(2)
    })

    const sold = await act(async () => result.current.sellBatch([9, 10]))

    expect(sold?.totalEarned).toBe(60)
    expect(result.current.items).toEqual([])
    expect(sellBatchMock).toHaveBeenCalledWith([9, 10])
  })
})
