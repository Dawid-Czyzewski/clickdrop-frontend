import { describe, expect, it } from 'vitest'
import { formatCountdown, msUntil } from '../../src/lib/formatCountdown'

describe('formatCountdown', () => {
  it('formats hours minutes seconds', () => {
    expect(formatCountdown(0)).toBe('00:00:00')
    expect(formatCountdown(3661000)).toBe('01:01:01')
  })

  it('computes ms until iso date', () => {
    const now = Date.parse('2026-09-25T12:00:00.000Z')
    expect(msUntil('2026-09-25T13:00:00.000Z', now)).toBe(3_600_000)
    expect(msUntil('2026-09-25T11:00:00.000Z', now)).toBe(0)
  })
})
