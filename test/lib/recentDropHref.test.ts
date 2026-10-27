import { describe, expect, it } from 'vitest'
import { recentDropHref } from '../../src/lib/recentDropHref'

describe('recentDropHref', () => {
  it('links to case detail when caseId is set', () => {
    expect(recentDropHref({ caseId: 10, source: 'CASE' })).toBe('/cases/10')
  })

  it('links to case detail when resolvedCaseId is provided', () => {
    expect(recentDropHref({ source: 'CASE' }, 19)).toBe('/cases/19')
  })

  it('links to daily for daily drops without caseId', () => {
    expect(recentDropHref({ source: 'DAILY' })).toBe('/daily')
  })

  it('falls back to cases section without caseId', () => {
    expect(recentDropHref({ source: 'CASE' })).toBe('/#cases')
    expect(recentDropHref({ caseId: 0, source: 'CASE' })).toBe('/#cases')
  })
})
