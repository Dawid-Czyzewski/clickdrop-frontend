import { describe, expect, it } from 'vitest'
import {
  formatIncomeRate,
  pendingIdleAmount,
  totalIdleIncomePerSecond,
  upgradeIdleRate,
} from '../../src/lib/idleIncome'

describe('idleIncome', () => {
  it('upgradeIdleRate multiplies catalog rate by level', () => {
    expect(upgradeIdleRate({ incomePerSecond: 0.1, level: 3 })).toBeCloseTo(0.3)
    expect(upgradeIdleRate({ incomePerSecond: 0.5, level: 0 })).toBe(0)
    expect(upgradeIdleRate({ incomePerSecond: 0, level: 5 })).toBe(0)
  })

  it('totalIdleIncomePerSecond sums owned idle rates', () => {
    expect(
      totalIdleIncomePerSecond([
        { incomePerSecond: 0.1, level: 1 },
        { incomePerSecond: 0.5, level: 2 },
        { incomePerSecond: 1, level: 0 },
        { incomePerSecond: 0, level: 4 },
      ]),
    ).toBeCloseTo(1.1)
  })

  it('pendingIdleAmount accrues from last collect timestamp', () => {
    const last = new Date('2026-10-06T12:00:00.000Z').toISOString()
    const now = Date.parse('2026-10-06T12:00:10.000Z')
    expect(pendingIdleAmount(0.1, last, now)).toBe(1)
    expect(pendingIdleAmount(0, last, now)).toBe(0)
  })

  it('formatIncomeRate keeps small CD/s readable', () => {
    expect(formatIncomeRate(0.1, 'en')).toMatch(/0\.1/)
    expect(formatIncomeRate(2, 'en')).toMatch(/2/)
  })
})
