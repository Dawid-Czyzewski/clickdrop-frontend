import { ApiError } from '../api/client'

export type VerifyTokenStatus =
  | 'loading'
  | 'success'
  | 'invalid'
  | 'expired'
  | 'alreadyVerified'
  | 'error'

export function mapVerifyEmailError(err: unknown): Exclude<VerifyTokenStatus, 'loading' | 'success'> {
  if (!(err instanceof ApiError)) {
    return 'error'
  }

  const message = err.message.toLowerCase()
  if (message.includes('expired')) {
    return 'expired'
  }
  if (message.includes('already verified')) {
    return 'alreadyVerified'
  }
  if (message.includes('invalid') || err.status === 400) {
    return 'invalid'
  }
  return 'error'
}
