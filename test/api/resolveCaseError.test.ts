import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveCaseError } from '../../src/api/resolveCaseError'

const t = (key: string, options?: Record<string, unknown>) =>
  options ? `${key}:${JSON.stringify(options)}` : key

describe('resolveCaseError', () => {
  it('maps known statuses', () => {
    expect(resolveCaseError(new ApiError(400, 'x'), t)).toBe('cases.insufficientFunds')
    expect(resolveCaseError(new ApiError(401, 'x'), t)).toBe('cases.errorUnauthorized')
    expect(resolveCaseError(new ApiError(403, 'x'), t)).toBe('cases.errorLevelLocked')
    expect(resolveCaseError(new ApiError(404, 'x'), t)).toBe('cases.errorNotFound')
    expect(resolveCaseError(new ApiError(429, 'x'), t)).toBe('cases.errorTooFast')
    expect(resolveCaseError(new ApiError(500, 'x'), t)).toBe('cases.errorServer')
  })

  it('maps open-count 403 from details', () => {
    expect(
      resolveCaseError(
        new ApiError(403, 'Case open ×5 requires level 10, user has 4', {
          requestedCount: '5',
          requiredLevel: '10',
          userLevel: '4',
        }),
        t,
      ),
    ).toBe('cases.errorOpenCountLocked:{"level":"10","count":"5"}')
  })

  it('maps open-count 403 from message when details missing', () => {
    expect(
      resolveCaseError(
        new ApiError(403, 'Case open ×3 requires level 5, user has 2'),
        t,
      ),
    ).toBe('cases.errorOpenCountLockedGeneric')
  })

  it('falls back for unknown errors', () => {
    expect(resolveCaseError(new Error('boom'), t)).toBe('cases.error')
  })
})
