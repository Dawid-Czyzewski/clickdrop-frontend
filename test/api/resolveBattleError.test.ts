import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveBattleError } from '../../src/api/resolveBattleError'

const t = (key: string) => key

describe('resolveBattleError', () => {
  it('maps funds and in-progress errors', () => {
    expect(resolveBattleError(new ApiError(400, 'Insufficient ClickDollars'), t)).toBe(
      'battles.errorFunds',
    )
    expect(resolveBattleError(new ApiError(409, 'not joinable'), t)).toBe(
      'battles.errorInProgress',
    )
    expect(resolveBattleError(new ApiError(401, 'x'), t)).toBe('battles.errorUnauthorized')
  })
})
