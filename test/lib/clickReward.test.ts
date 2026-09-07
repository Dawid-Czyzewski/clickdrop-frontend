import { describe, expect, it } from 'vitest'
import { BASE_CLICK_REWARD, totalClickReward, upgradeBonusPerClick } from '../../src/lib/clickReward'

describe('clickReward', () => {
  it('multiplies click power by owned level', () => {
    expect(upgradeBonusPerClick({ clickPower: 1, level: 3 })).toBe(3)
    expect(upgradeBonusPerClick({ clickPower: 2, level: 1 })).toBe(2)
    expect(upgradeBonusPerClick({ clickPower: 1, level: 0 })).toBe(0)
  })

  it('sums base reward with all upgrade bonuses', () => {
    expect(totalClickReward([])).toBe(BASE_CLICK_REWARD)
    expect(
      totalClickReward([
        { clickPower: 1, level: 3 },
        { clickPower: 2, level: 1 },
      ]),
    ).toBe(1 + 3 + 2)
  })
})
