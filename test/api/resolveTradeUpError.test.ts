import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveTradeUpError } from '../../src/api/resolveTradeUpError'

const t = (key: string) => key

describe('resolveTradeUpError', () => {
  it('maps known statuses', () => {
    expect(resolveTradeUpError(new ApiError(400, 'x'), t)).toBe('tradeUp.errorInvalid')
    expect(resolveTradeUpError(new ApiError(401, 'x'), t)).toBe('tradeUp.errorUnauthorized')
    expect(resolveTradeUpError(new ApiError(404, 'x'), t)).toBe('tradeUp.errorNotFound')
    expect(resolveTradeUpError(new ApiError(500, 'x'), t)).toBe('tradeUp.errorServer')
  })

  it('falls back for unknown errors', () => {
    expect(resolveTradeUpError(new Error('boom'), t)).toBe('tradeUp.error')
  })
})
