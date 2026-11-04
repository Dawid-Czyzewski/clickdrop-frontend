import { describe, expect, it } from 'vitest'
import { levelUpCashReward } from '../../src/lib/levelUpCashReward'

describe('levelUpCashReward', () => {
  it('pays 50 CD per gained level', () => {
    expect(levelUpCashReward(3, 4)).toBe(50)
    expect(levelUpCashReward(3, 5)).toBe(100)
    expect(levelUpCashReward(3, 3)).toBe(0)
    expect(levelUpCashReward(3, null)).toBe(0)
  })
})
