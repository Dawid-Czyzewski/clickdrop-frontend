import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveEconomyError } from '../../src/api/resolveEconomyError'

const t = (key: string) => key

describe('resolveEconomyError', () => {
  it('maps known API statuses', () => {
    expect(resolveEconomyError(new ApiError(401, 'x'), t)).toBe('home.earn.errorUnauthorized')
    expect(resolveEconomyError(new ApiError(404, 'x'), t)).toBe('home.earn.errorNotFound')
    expect(resolveEconomyError(new ApiError(503, 'x'), t)).toBe('home.earn.errorServer')
  })

  it('falls back for unknown errors', () => {
    expect(resolveEconomyError(new Error('boom'), t)).toBe('home.earn.error')
    expect(resolveEconomyError(new ApiError(400, 'x'), t)).toBe('home.earn.error')
  })
})
