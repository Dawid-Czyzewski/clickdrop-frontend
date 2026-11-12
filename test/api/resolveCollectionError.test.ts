import { describe, expect, it } from 'vitest'
import { ApiError } from '../../src/api/client'
import { resolveCollectionError } from '../../src/api/resolveCollectionError'

const t = (key: string) => key

describe('resolveCollectionError', () => {
  it('maps incomplete and already claimed codes', () => {
    expect(
      resolveCollectionError(
        new ApiError(409, 'x', { code: 'COLLECTION_INCOMPLETE' }),
        t,
      ),
    ).toBe('collections.errorIncomplete')
    expect(
      resolveCollectionError(
        new ApiError(409, 'x', { code: 'COLLECTION_ALREADY_CLAIMED' }),
        t,
      ),
    ).toBe('collections.errorAlreadyClaimed')
  })

  it('maps status fallbacks', () => {
    expect(resolveCollectionError(new ApiError(404, 'x'), t)).toBe(
      'collections.errorNotFound',
    )
    expect(resolveCollectionError(new ApiError(401, 'x'), t)).toBe(
      'collections.errorUnauthorized',
    )
    expect(resolveCollectionError(new Error('boom'), t)).toBe('collections.error')
  })
})
