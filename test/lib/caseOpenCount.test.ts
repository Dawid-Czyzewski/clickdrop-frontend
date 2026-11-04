import { describe, expect, it } from 'vitest'
import {
  clampOpenCount,
  isOpenCountLocked,
  maxOpenCountForLevel,
  requiredLevelForOpenCount,
} from '../../src/lib/caseOpenCount'

const thresholds = {
  openX3MinLevel: 5,
  openX5MinLevel: 10,
  maxOpenCount: 5,
}

describe('caseOpenCount', () => {
  it('uses API thresholds with BE defaults', () => {
    expect(requiredLevelForOpenCount({}, 1)).toBe(1)
    expect(requiredLevelForOpenCount({}, 3)).toBe(5)
    expect(requiredLevelForOpenCount({}, 5)).toBe(10)
    expect(requiredLevelForOpenCount(thresholds, 3)).toBe(5)
    expect(requiredLevelForOpenCount({ openX3MinLevel: 7 }, 3)).toBe(7)
  })

  it('resolves max unlocked count by level', () => {
    expect(maxOpenCountForLevel(thresholds, 1)).toBe(1)
    expect(maxOpenCountForLevel(thresholds, 4)).toBe(1)
    expect(maxOpenCountForLevel(thresholds, 5)).toBe(3)
    expect(maxOpenCountForLevel(thresholds, 9)).toBe(3)
    expect(maxOpenCountForLevel(thresholds, 10)).toBe(5)
    expect(maxOpenCountForLevel(thresholds, null)).toBe(1)
  })

  it('locks higher counts below threshold', () => {
    expect(isOpenCountLocked(thresholds, 1, 1)).toBe(false)
    expect(isOpenCountLocked(thresholds, 3, 4)).toBe(true)
    expect(isOpenCountLocked(thresholds, 3, 5)).toBe(false)
    expect(isOpenCountLocked(thresholds, 5, 9)).toBe(true)
    expect(isOpenCountLocked(thresholds, 5, 10)).toBe(false)
  })

  it('clamps selected count down to unlocked max', () => {
    expect(clampOpenCount(thresholds, 5, 1)).toBe(1)
    expect(clampOpenCount(thresholds, 5, 5)).toBe(3)
    expect(clampOpenCount(thresholds, 5, 10)).toBe(5)
    expect(clampOpenCount(thresholds, 3, 10)).toBe(3)
  })
})
