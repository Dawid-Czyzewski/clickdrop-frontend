import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveSkinUpgradeError } from '../../src/api/resolveSkinUpgradeError'

const t = (key: string) => key

describe('resolveSkinUpgradeError', () => {
  it('maps known statuses', () => {
    expect(resolveSkinUpgradeError(new ApiError(400, 'x'), t)).toBe(
      'skinUpgrade.errorNoTargets',
    )
    expect(resolveSkinUpgradeError(new ApiError(401, 'x'), t)).toBe(
      'skinUpgrade.errorUnauthorized',
    )
    expect(resolveSkinUpgradeError(new ApiError(404, 'x'), t)).toBe(
      'skinUpgrade.errorNotFound',
    )
    expect(resolveSkinUpgradeError(new ApiError(500, 'x'), t)).toBe(
      'skinUpgrade.errorServer',
    )
  })

  it('falls back for unknown errors', () => {
    expect(resolveSkinUpgradeError(new Error('boom'), t)).toBe('skinUpgrade.error')
  })
})
