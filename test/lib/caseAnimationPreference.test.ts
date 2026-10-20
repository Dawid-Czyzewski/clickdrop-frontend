import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getSkipCaseAnimationPreference,
  setSkipCaseAnimationPreference,
  shouldSkipCaseSpin,
} from '../../src/lib/caseAnimationPreference'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('caseAnimationPreference', () => {
  beforeEach(() => {
    localStorage.clear()
    mockReducedMotion(false)
  })

  it('persists skip toggle in localStorage', () => {
    expect(getSkipCaseAnimationPreference()).toBe(false)
    setSkipCaseAnimationPreference(true)
    expect(getSkipCaseAnimationPreference()).toBe(true)
    expect(localStorage.getItem('clickdrop_skip_case_animation')).toBe('1')
  })

  it('skips spin when preference is on without reduced-motion', () => {
    mockReducedMotion(false)
    setSkipCaseAnimationPreference(true)
    expect(shouldSkipCaseSpin()).toBe(true)
  })

  it('skips spin for reduced-motion even when preference is off', () => {
    mockReducedMotion(true)
    setSkipCaseAnimationPreference(false)
    expect(shouldSkipCaseSpin()).toBe(true)
  })
})
