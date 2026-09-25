import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveCaseError } from '../../src/api/resolveCaseError'

const t = (key: string) => key

describe('resolveCaseError', () => {
  it('maps known statuses', () => {
    expect(resolveCaseError(new ApiError(400, 'x'), t)).toBe('cases.insufficientFunds')
    expect(resolveCaseError(new ApiError(401, 'x'), t)).toBe('cases.errorUnauthorized')
    expect(resolveCaseError(new ApiError(404, 'x'), t)).toBe('cases.errorNotFound')
    expect(resolveCaseError(new ApiError(429, 'x'), t)).toBe('cases.errorTooFast')
    expect(resolveCaseError(new ApiError(500, 'x'), t)).toBe('cases.errorServer')
  })

  it('falls back for unknown errors', () => {
    expect(resolveCaseError(new Error('boom'), t)).toBe('cases.error')
  })
})
