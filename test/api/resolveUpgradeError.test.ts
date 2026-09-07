import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveUpgradeError } from '../../src/api/resolveUpgradeError'

const t = (key: string) => key

describe('resolveUpgradeError', () => {
  it('maps insufficient funds and auth statuses', () => {
    expect(resolveUpgradeError(new ApiError(400, 'x'), t)).toBe('upgrades.insufficientFunds')
    expect(resolveUpgradeError(new ApiError(401, 'x'), t)).toBe('upgrades.errorUnauthorized')
    expect(resolveUpgradeError(new ApiError(404, 'x'), t)).toBe('upgrades.errorNotFound')
    expect(resolveUpgradeError(new ApiError(503, 'x'), t)).toBe('upgrades.errorServer')
  })

  it('falls back for unknown errors', () => {
    expect(resolveUpgradeError(new Error('boom'), t)).toBe('upgrades.error')
  })
})
