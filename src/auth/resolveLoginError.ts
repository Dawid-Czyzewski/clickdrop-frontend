import type { TFunction } from 'i18next'
import { ApiError } from '../api/client'

export type LoginErrorResult =
  | { kind: 'message'; message: string }
  | { kind: 'notVerified' }

export function resolveLoginError(err: unknown, t: TFunction): LoginErrorResult {
  if (!(err instanceof ApiError)) {
    return { kind: 'message', message: t('login.networkError') }
  }

  if (err.status === 401) {
    return { kind: 'message', message: t('login.invalidCredentials') }
  }

  if (err.status === 403) {
    return { kind: 'notVerified' }
  }

  if (err.status === 400) {
    return { kind: 'message', message: t('login.validationError') }
  }

  return { kind: 'message', message: t('login.error') }
}
