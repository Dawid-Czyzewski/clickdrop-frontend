import { describe, expect, it } from 'vitest'
import { resolveCaseLabel, resolveItemLabel } from '../../src/lib/caseI18n'

describe('resolveItemLabel / resolveCaseLabel', () => {
  it('prefers API displayName when present', () => {
    const t = (key: string) => `i18n:${key}`
    expect(resolveItemLabel(t, 'AK_47_SLATE', 'AK-47 | Slate')).toBe('AK-47 | Slate')
    expect(resolveCaseLabel(t, 'KILOWATT_CASE', 'Kilowatt Case')).toBe('Kilowatt Case')
  })

  it('falls back to i18n when displayName missing', () => {
    const t = (key: string) =>
      key === 'items.AK_47_SLATE.name' ? 'AK-47 | Slate' : key === 'cases.REVOLUTION_CASE.name' ? 'Revolution Case' : key
    expect(resolveItemLabel(t, 'AK_47_SLATE')).toBe('AK-47 | Slate')
    expect(resolveCaseLabel(t, 'REVOLUTION_CASE', '')).toBe('Revolution Case')
  })

  it('humanizes code when i18n key is missing', () => {
    const t = (key: string) => key
    expect(resolveItemLabel(t, 'AK_47_ASIIMOV')).toBe('Ak 47 Asiimov')
    expect(resolveCaseLabel(t, 'REVOLUTION_CASE')).toBe('Revolution Case')
  })
})
