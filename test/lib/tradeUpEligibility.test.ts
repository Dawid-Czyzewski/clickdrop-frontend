import { describe, expect, it } from 'vitest'
import type { InventoryItem, ItemExterior } from '../../src/api/casesApi'
import {
  averageExterior,
  canTradeUp,
  nextRarity,
  resultStatTrack,
  validateTradeUp,
} from '../../src/lib/tradeUpEligibility'

function item(
  id: number,
  rarity: InventoryItem['rarity'],
  exterior: ItemExterior = 'FIELD_TESTED',
  statTrack = false,
): InventoryItem {
  return {
    inventoryItemId: id,
    itemId: id,
    code: `SKU_${id}`,
    displayName: `Sku ${id}`,
    rarity,
    exterior,
    statTrack,
    suggestedSellPrice: 10,
    createdAt: '2026-01-01T00:00:00Z',
  }
}

describe('tradeUpEligibility', () => {
  it('validates exactly 10 same tradeable rarity', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(i + 1, 'MIL_SPEC'))
    expect(canTradeUp(items)).toBe(true)
    expect(validateTradeUp(items)).toEqual({
      ok: true,
      rarity: 'MIL_SPEC',
      targetRarity: 'RESTRICTED',
    })
  })

  it('rejects wrong count, mixed rarity, or covert', () => {
    expect(validateTradeUp(Array.from({ length: 9 }, (_, i) => item(i + 1, 'MIL_SPEC')))).toEqual({
      ok: false,
      reason: 'count',
    })
    const mixed = Array.from({ length: 9 }, (_, i) => item(i + 1, 'MIL_SPEC'))
    mixed.push(item(10, 'RESTRICTED'))
    expect(validateTradeUp(mixed)).toEqual({ ok: false, reason: 'rarity' })
    expect(validateTradeUp(Array.from({ length: 10 }, (_, i) => item(i + 1, 'COVERT')))).toEqual({
      ok: false,
      reason: 'covert',
    })
  })

  it('averages exterior and inherits StatTrack only when all ST', () => {
    expect(nextRarity('CLASSIFIED')).toBe('COVERT')
    const exteriors: ItemExterior[] = [
      ...Array.from({ length: 5 }, () => 'FACTORY_NEW' as const),
      ...Array.from({ length: 5 }, () => 'BATTLE_SCARRED' as const),
    ]
    expect(averageExterior(exteriors)).toBe('FIELD_TESTED')
    expect(resultStatTrack(Array.from({ length: 10 }, (_, i) => item(i + 1, 'MIL_SPEC', 'FIELD_TESTED', true)))).toBe(
      true,
    )
    expect(
      resultStatTrack([
        ...Array.from({ length: 9 }, (_, i) => item(i + 1, 'MIL_SPEC', 'FIELD_TESTED', true)),
        item(10, 'MIL_SPEC', 'FIELD_TESTED', false),
      ]),
    ).toBe(false)
  })
})
