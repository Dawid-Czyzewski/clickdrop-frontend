import { beforeEach, describe, expect, it } from 'vitest'
import type { InventoryItem } from '../../src/api/casesApi'
import {
  applyInventoryFilters,
  DEFAULT_INVENTORY_FILTERS,
  filterInventoryItems,
  hasActiveInventoryFilters,
  loadInventoryFilters,
  saveInventoryFilters,
  sortInventoryItems,
} from '../../src/lib/inventoryFilters'

const slate: InventoryItem = {
  inventoryItemId: 9,
  itemId: 3,
  code: 'AK_47_SLATE',
  displayName: 'AK-47 | Slate',
  rarity: 'RESTRICTED',
  exterior: 'FIELD_TESTED',
  floatValue: 0.25,
  paintSeed: 123,
  suggestedSellPrice: 40,
  createdAt: '2026-01-01T00:00:00Z',
}

const glock: InventoryItem = {
  inventoryItemId: 10,
  itemId: 1,
  code: 'GLOCK_18_UMBRAL_RABBIT',
  displayName: 'Glock-18 | Umbral Rabbit',
  rarity: 'MIL_SPEC',
  exterior: 'MINIMAL_WEAR',
  floatValue: 0.1,
  paintSeed: 45,
  suggestedSellPrice: 20,
  createdAt: '2026-01-01T00:00:00Z',
}

const stAsiimov: InventoryItem = {
  inventoryItemId: 11,
  itemId: 6,
  code: 'AK_47_ASIIMOV',
  displayName: 'AK-47 | Asiimov',
  rarity: 'COVERT',
  exterior: 'FIELD_TESTED',
  statTrack: true,
  floatValue: 0.22,
  paintSeed: 777,
  suggestedSellPrice: 120,
  createdAt: '2026-01-01T00:00:00Z',
}

describe('inventoryFilters', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('filters by rarity, exterior, and StatTrack', () => {
    const items = [slate, glock, stAsiimov]
    expect(
      filterInventoryItems(items, { ...DEFAULT_INVENTORY_FILTERS, rarity: 'MIL_SPEC' }),
    ).toEqual([glock])
    expect(
      filterInventoryItems(items, {
        ...DEFAULT_INVENTORY_FILTERS,
        exterior: 'FIELD_TESTED',
      }),
    ).toEqual([slate, stAsiimov])
    expect(
      filterInventoryItems(items, { ...DEFAULT_INVENTORY_FILTERS, statTrack: 'yes' }),
    ).toEqual([stAsiimov])
    expect(
      filterInventoryItems(items, { ...DEFAULT_INVENTORY_FILTERS, statTrack: 'no' }),
    ).toEqual([slate, glock])
  })

  it('sorts by price, rarity, and name', () => {
    const items = [glock, stAsiimov, slate]
    expect(
      sortInventoryItems(items, 'price_desc').map((i) => i.inventoryItemId),
    ).toEqual([11, 9, 10])
    expect(
      sortInventoryItems(items, 'price_asc').map((i) => i.inventoryItemId),
    ).toEqual([10, 9, 11])
    expect(sortInventoryItems(items, 'rarity').map((i) => i.inventoryItemId)).toEqual([
      11, 9, 10,
    ])
    expect(sortInventoryItems(items, 'name').map((i) => i.displayName)).toEqual([
      'AK-47 | Asiimov',
      'AK-47 | Slate',
      'Glock-18 | Umbral Rabbit',
    ])
  })

  it('persists filters in localStorage', () => {
    const next = {
      ...DEFAULT_INVENTORY_FILTERS,
      rarity: 'COVERT' as const,
      sort: 'name' as const,
    }
    saveInventoryFilters(next)
    expect(loadInventoryFilters()).toEqual(next)
    expect(hasActiveInventoryFilters(next)).toBe(true)
    expect(hasActiveInventoryFilters(DEFAULT_INVENTORY_FILTERS)).toBe(false)
  })

  it('applies filter then sort', () => {
    const result = applyInventoryFilters(
      [glock, stAsiimov, slate],
      { ...DEFAULT_INVENTORY_FILTERS, rarity: 'RESTRICTED', sort: 'price_asc' },
    )
    expect(result).toEqual([slate])
  })
})
