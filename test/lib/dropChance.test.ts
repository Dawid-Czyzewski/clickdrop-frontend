import { describe, expect, it } from 'vitest'
import {
  dropChancePercent,
  formatDropChance,
  formatDropChanceNumber,
  resolveDropChancePercent,
  totalDropWeight,
} from '../../src/lib/dropChance'

describe('dropChance', () => {
  it('computes percent from weights', () => {
    expect(totalDropWeight([50, 30, 15, 5])).toBe(100)
    expect(dropChancePercent(50, 100)).toBe(50)
    expect(dropChancePercent(5, 100)).toBe(5)
  })

  it('prefers API chancePercent over weight math', () => {
    expect(resolveDropChancePercent({ weight: 50, chancePercent: 12.5 }, 100)).toBe(12.5)
    expect(resolveDropChancePercent({ weight: 50 }, 100)).toBe(50)
  })

  it('formats chance for locale', () => {
    expect(formatDropChanceNumber(12.5, 'en')).toBe('12.5')
    expect(formatDropChance(12.5, 'en')).toBe('12.5%')
    expect(formatDropChance(50, 'en')).toBe('50%')
  })
})
