import { describe, expect, it } from 'vitest'
import type { InventoryItem } from '../../src/api/casesApi'
import { canTradeUp } from '../../src/lib/tradeUpEligibility'

function item(id: number, rarity: InventoryItem['rarity']): InventoryItem {
  return {
    inventoryItemId: id,
    itemId: id,
    code: `SKU_${id}`,
    displayName: `Sku ${id}`,
    rarity,
    exterior: 'FIELD_TESTED',
    suggestedSellPrice: 10,
    createdAt: '2026-01-01T00:00:00Z',
  }
}

describe('canTradeUp', () => {
  it('allows exactly 10 same tradeable rarity', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(i + 1, 'MIL_SPEC'))
    expect(canTradeUp(items)).toBe(true)
  })

  it('rejects wrong count, mixed rarity, or covert', () => {
    expect(canTradeUp(Array.from({ length: 9 }, (_, i) => item(i + 1, 'MIL_SPEC')))).toBe(
      false,
    )
    const mixed = Array.from({ length: 9 }, (_, i) => item(i + 1, 'MIL_SPEC'))
    mixed.push(item(10, 'RESTRICTED'))
    expect(canTradeUp(mixed)).toBe(false)
    expect(canTradeUp(Array.from({ length: 10 }, (_, i) => item(i + 1, 'COVERT')))).toBe(
      false,
    )
  })
})
