import { describe, expect, it } from 'vitest'
import {
  resolveCaseIdFromLookup,
  type CaseLookup,
} from '../../src/lib/recentDropCaseLookup'

const lookup: CaseLookup = {
  idByCode: new Map([['CS20_CASE', 19]]),
  idByItemCode: new Map([['SCAR_20_ASSAULT', 19]]),
}

describe('resolveCaseIdFromLookup', () => {
  it('prefers explicit caseId', () => {
    expect(
      resolveCaseIdFromLookup(
        { caseId: 10, caseCode: 'CS20_CASE', itemCode: 'SCAR_20_ASSAULT', source: 'CASE' },
        lookup,
      ),
    ).toBe(10)
  })

  it('resolves via caseCode when caseId missing', () => {
    expect(
      resolveCaseIdFromLookup(
        { caseCode: 'CS20_CASE', itemCode: 'OTHER', source: 'CASE' },
        lookup,
      ),
    ).toBe(19)
  })

  it('resolves via itemCode when API omits case refs', () => {
    expect(
      resolveCaseIdFromLookup(
        { itemCode: 'SCAR_20_ASSAULT', source: 'CASE' },
        lookup,
      ),
    ).toBe(19)
  })

  it('returns undefined for daily or missing lookup', () => {
    expect(
      resolveCaseIdFromLookup({ itemCode: 'SCAR_20_ASSAULT', source: 'DAILY' }, lookup),
    ).toBeUndefined()
    expect(
      resolveCaseIdFromLookup({ itemCode: 'SCAR_20_ASSAULT', source: 'CASE' }, null),
    ).toBeUndefined()
  })
})
