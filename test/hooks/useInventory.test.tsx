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
}))

import { getInventory, openCase, sellInventoryItem } from '../../src/api/casesApi'

const getInventoryMock = vi.mocked(getInventory)
const openCaseMock = vi.mocked(openCase)
const sellMock = vi.mocked(sellInventoryItem)

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
})
