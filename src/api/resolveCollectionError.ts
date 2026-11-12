import { ApiError } from './client'

export function resolveCollectionError(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    const code = err.details?.code
    if (code === 'COLLECTION_INCOMPLETE') return t('collections.errorIncomplete')
    if (code === 'COLLECTION_ALREADY_CLAIMED') return t('collections.errorAlreadyClaimed')
    if (err.status === 404) return t('collections.errorNotFound')
    if (err.status === 401) return t('collections.errorUnauthorized')
    if (err.status === 409) return t('collections.errorAlreadyClaimed')
    if (err.status >= 500) return t('collections.errorServer')
  }

  return t('collections.error')
}
