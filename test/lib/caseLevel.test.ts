import { describe, expect, it } from 'vitest'
import {
  caseMinLevel,
  compareCasesByLevel,
  isCaseLevelLocked,
} from '../../src/lib/caseLevel'

describe('caseLevel', () => {
  it('defaults minLevel to 1', () => {
    expect(caseMinLevel({})).toBe(1)
    expect(caseMinLevel({ minLevel: 5 })).toBe(5)
  })

  it('locks when user level is below minLevel', () => {
    expect(isCaseLevelLocked({ minLevel: 5 }, 4)).toBe(true)
    expect(isCaseLevelLocked({ minLevel: 5 }, 5)).toBe(false)
    expect(isCaseLevelLocked({ minLevel: 5 }, null)).toBe(true)
    expect(isCaseLevelLocked({ minLevel: 5 }, undefined)).toBe(true)
    expect(isCaseLevelLocked({}, 1)).toBe(false)
    expect(isCaseLevelLocked({}, null)).toBe(true)
  })

  it('sorts by minLevel then sortOrder', () => {
    const cases = [
      { minLevel: 5, sortOrder: 1 },
      { minLevel: 1, sortOrder: 3 },
      { minLevel: 1, sortOrder: 1 },
      { sortOrder: 2 },
    ]
    expect([...cases].sort(compareCasesByLevel).map((c) => c.sortOrder)).toEqual([
      1, 2, 3, 1,
    ])
    expect([...cases].sort(compareCasesByLevel).map((c) => caseMinLevel(c))).toEqual([
      1, 1, 1, 5,
    ])
  })
})
