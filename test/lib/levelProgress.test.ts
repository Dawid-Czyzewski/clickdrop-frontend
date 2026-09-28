import { describe, expect, it } from 'vitest'
import { levelProgress, XP_PER_LEVEL } from '../../src/lib/levelProgress'

describe('levelProgress', () => {
  it('starts empty at 0 XP', () => {
    expect(levelProgress(0)).toEqual({
      currentXp: 0,
      xpForLevel: XP_PER_LEVEL,
      ratio: 0,
    })
  })

  it('maps mid-level XP to a half-full bar', () => {
    expect(levelProgress(50)).toEqual({
      currentXp: 50,
      xpForLevel: XP_PER_LEVEL,
      ratio: 0.5,
    })
  })

  it('resets progress at exact level thresholds', () => {
    expect(levelProgress(100)).toEqual({
      currentXp: 0,
      xpForLevel: XP_PER_LEVEL,
      ratio: 0,
    })
  })

  it('uses remainder of cumulative XP', () => {
    expect(levelProgress(3200)).toEqual({
      currentXp: 0,
      xpForLevel: XP_PER_LEVEL,
      ratio: 0,
    })
    expect(levelProgress(3250).currentXp).toBe(50)
  })
})
