import { describe, expect, it } from 'vitest'
import { formatClickDollars } from '../../src/lib/formatClickDollars'

describe('formatClickDollars', () => {
  it('formats value with two decimal places', () => {
    expect(formatClickDollars(99.5, 'en')).toBe('99.50')
    expect(formatClickDollars(150.75, 'en')).toBe('150.75')
  })
})
