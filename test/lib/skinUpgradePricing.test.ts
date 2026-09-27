import { describe, expect, it } from 'vitest'
import type { SkinUpgradeTarget } from '../../src/api/skinUpgradeApi'
import {
  filterTargetsInPriceBand,
  maxUpgradeTargetPrice,
} from '../../src/lib/skinUpgradePricing'

function target(price: number, code = 'X'): SkinUpgradeTarget {
  return {
    itemId: 1,
    itemCode: code,
    itemDisplayName: code,
    rarity: 'COVERT',
    exterior: 'FIELD_TESTED',
    suggestedSellPrice: price,
  }
}

describe('skinUpgradePricing', () => {
  it('caps max target near 1.75x current (15 → 26.25)', () => {
    expect(maxUpgradeTargetPrice(15)).toBe(26.25)
    expect(maxUpgradeTargetPrice(20)).toBe(35)
  })

  it('drops targets above the price band', () => {
    const kept = filterTargetsInPriceBand(15, [
      target(18, 'CHEAP'),
      target(26.25, 'EDGE'),
      target(40, 'MID'),
      target(250, 'AWP'),
    ])

    expect(kept.map((t) => t.itemCode)).toEqual(['CHEAP', 'EDGE'])
  })

  it('requires target price strictly above current', () => {
    const kept = filterTargetsInPriceBand(15, [target(15, 'SAME'), target(16, 'UP')])
    expect(kept.map((t) => t.itemCode)).toEqual(['UP'])
  })
})
