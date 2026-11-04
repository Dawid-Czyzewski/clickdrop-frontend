import { describe, expect, it } from 'vitest'
import { isUpgradeLevelLocked, upgradeMinLevel } from '../../src/lib/upgradeLevel'

describe('upgradeLevel', () => {
  it('defaults minLevel to 1', () => {
    expect(upgradeMinLevel({})).toBe(1)
    expect(upgradeMinLevel({ minLevel: 5 })).toBe(5)
  })

  it('locks when user level is below minLevel', () => {
    expect(isUpgradeLevelLocked({ minLevel: 5 }, 4)).toBe(true)
    expect(isUpgradeLevelLocked({ minLevel: 5 }, 5)).toBe(false)
    expect(isUpgradeLevelLocked({ minLevel: 5 }, null)).toBe(true)
    expect(isUpgradeLevelLocked({}, 1)).toBe(false)
  })
})
