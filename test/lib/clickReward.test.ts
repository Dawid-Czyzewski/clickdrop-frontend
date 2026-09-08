import { describe, expect, it } from 'vitest'
import { upgradeBonusPerClick } from '../../src/lib/clickReward'

describe('upgradeBonusPerClick', () => {
  it('multiplies click power by owned level for chip display', () => {
    expect(upgradeBonusPerClick({ clickPower: 1, level: 3 })).toBe(3)
    expect(upgradeBonusPerClick({ clickPower: 2, level: 1 })).toBe(2)
    expect(upgradeBonusPerClick({ clickPower: 1, level: 0 })).toBe(0)
  })
})
