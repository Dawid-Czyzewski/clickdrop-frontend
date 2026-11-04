import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveUpgradeError } from '../../src/api/resolveUpgradeError'

const t = (key: string, options?: Record<string, unknown>) =>
  options ? `${key}:${JSON.stringify(options)}` : key

describe('resolveUpgradeError', () => {
  it('maps insufficient funds and auth statuses', () => {
    expect(resolveUpgradeError(new ApiError(400, 'x'), t)).toBe('upgrades.insufficientFunds')
    expect(resolveUpgradeError(new ApiError(401, 'x'), t)).toBe('upgrades.errorUnauthorized')
    expect(resolveUpgradeError(new ApiError(404, 'x'), t)).toBe('upgrades.errorNotFound')
    expect(resolveUpgradeError(new ApiError(503, 'x'), t)).toBe('upgrades.errorServer')
  })

  it('maps 403 level gate from details', () => {
    expect(
      resolveUpgradeError(
        new ApiError(403, 'Upgrade requires level 5, user has 2', {
          requiredLevel: '5',
          userLevel: '2',
        }),
        t,
      ),
    ).toBe('upgrades.errorLevelLocked:{"level":"5"}')
  })

  it('maps 403 without details to generic message', () => {
    expect(resolveUpgradeError(new ApiError(403, 'forbidden'), t)).toBe(
      'upgrades.errorLevelLockedGeneric',
    )
  })

  it('falls back for unknown errors', () => {
    expect(resolveUpgradeError(new Error('boom'), t)).toBe('upgrades.error')
  })
})
