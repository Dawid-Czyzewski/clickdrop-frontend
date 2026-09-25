import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveDailyError } from '../../src/api/resolveDailyError'

const t = (key: string) => key

describe('resolveDailyError', () => {
  it('maps known API statuses', () => {
    expect(resolveDailyError(new ApiError(400, 'x'), t)).toBe('daily.errorTooEarly')
    expect(resolveDailyError(new ApiError(429, 'x'), t)).toBe('daily.errorTooEarly')
    expect(resolveDailyError(new ApiError(401, 'x'), t)).toBe('daily.errorUnauthorized')
    expect(resolveDailyError(new ApiError(503, 'x'), t)).toBe('daily.errorServer')
  })

  it('falls back for unknown errors', () => {
    expect(resolveDailyError(new Error('boom'), t)).toBe('daily.error')
  })
})
